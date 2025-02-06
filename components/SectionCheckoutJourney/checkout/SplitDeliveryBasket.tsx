import { Guid } from "@commerce/types"
import { useTranslation } from "@commerce/utils/use-translation"
import BasketGroupProduct from "@components/cart/BasketGroupProduct"
import cartHandler from "@components/services/cart"
import { useUI } from "@components/ui"
import { groupCartItemsById } from "@components/utils/cart"
import { NEXT_BASKET_VALIDATE, NEXT_SHIPPING_PLANS } from "@components/utils/constants"
import { IMG_PLACEHOLDER } from "@components/utils/textVariables"
import { getCartValidateMessages, vatIncluded } from "@framework/utils/app-util"
import { stringToBoolean, tryParseJson } from "@framework/utils/parse-util"
import axios from "axios"
import { round, sortBy } from "lodash"
import { useEffect, useState } from "react"

const SplitDeliveryBasketItems = ({ cartItem, cart, config }: any) => {
  const allowSplitShipping = stringToBoolean(
    config?.configSettings?.find((x: any) => x.configType === 'DomainSettings')?.configKeys?.find((x: any) => x.key === "DomainSettings.EnableOmniOms")?.value || ''
  ) && stringToBoolean(
    config?.configSettings?.find((x: any) => x.configType === 'OrderSettings')?.configKeys?.find((x: any) => x.key === "OrderSettings.EnabledPartialDelivery")?.value || ''
  )

  const { setCartItems, cartItems, basketId, setIsSplitDelivery, isSplitDelivery, closeSidebar } = useUI()
  const translate = useTranslation()
  const [splitDeliveryItems, setSplitDeliveryItems] = useState<any>(null)
  const [splitDeliveryDates, setSplitDeliveryDates] = useState<any>(null)
  const [splitBasketProducts, setSplitBasketProducts] = useState<any>({})
  const [reValidateData, setBasketReValidate] = useState<any>([])
  const [isOpen, setIsOpen] = useState(false)
  const [itemClicked, setItemClicked] = useState<any | Array<any>>()
  const [shippingPlans, setShippingPlans] = useState<any>([])

  useEffect(() => {
    const cartLineItems = mapSplitDeliveryPlansToItems(shippingPlans, cartItems?.lineItems)
    let splitProducts = groupItemsByDeliveryDate(cartLineItems)
    setSplitBasketProducts(splitProducts)
  }, [cartItems?.lineItems])

  const sortDates = (dateArray: any) => {
    const convertedDates = dateArray.map((dateString: any) => {
      const [day, month, year] = dateString.split('/')
      return new Date(`${month}/${day}/${year}`)
    })

    convertedDates.sort((a: any, b: any) => a - b)
    const sortedDates = convertedDates.map((date: any) => {
      const formattedDate = date.toLocaleDateString('en-GB')
      return formattedDate
    })

    return sortedDates
  }

  const deliveryDatesExtract = () => {
    if (splitDeliveryItems) {
      let sortedDeliveryDates = sortDates(Object.keys(splitDeliveryItems))
      setSplitDeliveryDates(sortedDeliveryDates)
    }
  }

  useEffect(() => {
    deliveryDatesExtract()
  }, [splitDeliveryItems])

  const mapShippingPlansToItems = (plans?: any, items?: any) => {
    const itemsClone = [...items]
    return plans?.reduce((acc: any, obj: any) => {
      acc?.forEach((cartItem?: any) => {
        const foundShippingPlan = obj.Items.find((item: any) => {
          return (
            item.ProductId.toLowerCase() === cartItem.productId.toLowerCase()
          )
        })
        if (foundShippingPlan) {
          cartItem.shippingPlan = obj
        }
      })
      return acc
    }, itemsClone)
  }

  const groupItemsByDeliveryDate = (items: any) => {
    const groupedItems: any = {}
    if (!items) return groupedItems
    for (const item of items) {
      const deliveryDate = new Date(
        item.deliveryDateTarget
      ).toLocaleDateString()

      if (groupedItems.hasOwnProperty(deliveryDate)) {
        groupedItems[deliveryDate].push(item)
      } else {
        groupedItems[deliveryDate] = [item]
      }
    }

    return groupedItems
  }
  const splitDeliveryExtract = (mutatedLineItems: any) => {
    let deliveryPlans = groupItemsByDeliveryDate([...mutatedLineItems])
    setSplitDeliveryItems(deliveryPlans)
  }

  const mapSplitDeliveryPlansToItems = (plans?: any, items?: any) => {
    const itemsClone = [...items]
    return plans?.reduce((acc: any, obj: any) => {
      acc?.forEach((cartItem?: any) => {
        const foundShippingPlan = obj.Items?.find((item: any) => {
          return (
            item.ProductId.toLowerCase() === cartItem.productId.toLowerCase()
          )
        })
        let deliveryDateTarget = obj.Items?.find((item: any) => item.ProductId?.toLowerCase() === cartItem.productId.toLowerCase())?.DeliveryDateTarget
        let shippingSpeed = obj.Items?.find((item: any) => item.ProductId?.toLowerCase() === cartItem.productId.toLowerCase())?.ShippingSpeed
        if (foundShippingPlan) {
          cartItem.shippingPlan = obj
          cartItem.deliveryDateTarget = deliveryDateTarget
          cartItem.shippingSpeed = shippingSpeed
        }
      })
      return acc
    }, itemsClone)
  }

  const fetchShippingPlans = async (items: any) => {
    if (items?.length < 1) {
      items = { ...cartItems }
    }
    const shippingMethodItem: any = cart?.shippingMethods.find((method: any) => method.id === cart?.shippingMethodId)
    const model = {
      BasketId: basketId,
      OrderId: Guid.empty,
      PostCode: cartItems?.postCode || '',
      ShippingMethodType: shippingMethodItem?.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem?.displayName,
      ShippingMethodCode: shippingMethodItem?.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item?.id),
          OrderLineRecordId: Guid.empty,
          ProductId: item?.productId,
          ParentProductId: item?.parentProductId,
          StockCode: item?.stockCode,
          Qty: item?.qty,
          PoolCode: item?.poolCode || null,
        }
      }),
      AllowPartialOrderDelivery: true,
      AllowPartialLineDelivery: true,
      PickupStoreId: Guid.empty,
      RefStoreId: null,
      PrimaryInventoryPool: 'PrimaryInvPool',
      SecondaryInventoryPool: 'PrimaryInvPool',
      IsEditOrder: false,
      OrderNo: null,
      DeliveryCenter: null,
    }

    const splitModel = {
      BasketId: basketId,
      OrderId: Guid.empty,
      PostCode: cartItems?.postCode || '',
      ShippingMethodType: shippingMethodItem?.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem?.displayName,
      ShippingMethodCode: shippingMethodItem?.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item?.id),
          OrderLineRecordId: Guid.empty,
          ProductId: item?.productId,
          ParentProductId: item?.parentProductId,
          StockCode: item?.stockCode,
          Qty: item?.qty,
          PoolCode: item?.poolCode || null,
        }
      }),
      AllowPartialOrderDelivery: true,
      AllowPartialLineDelivery: false,
      PickupStoreId: Guid.empty,
      RefStoreId: null,
      PrimaryInventoryPool: 'PrimaryInvPool',
      SecondaryInventoryPool: 'PrimaryInvPool',
      IsEditOrder: false,
      OrderNo: null,
      DeliveryCenter: null,
    }
    const { data: shippingPlans } = await axios.post(NEXT_SHIPPING_PLANS, {
      model: allowSplitShipping ? splitModel : model,
    })
    setShippingPlans(shippingPlans)
    // const shippingPlans = await getShippingPlans()({ model: model })
    if (shippingPlans.length > 1 && allowSplitShipping) {
      setIsSplitDelivery(true)
      splitDeliveryExtract(
        mapSplitDeliveryPlansToItems(shippingPlans || [], items?.lineItems) //cart
      )

      setCartItems({
        ...items, //cart
        lineItems: mapSplitDeliveryPlansToItems(
          shippingPlans || [],
          items?.lineItems
        ),
      })
    } else {
      setIsSplitDelivery(false)
      setCartItems({
        ...cart,
        lineItems: mapShippingPlansToItems(shippingPlans || [], cart?.lineItems),
      })
    }
  }
  const fetchBasketReValidate = async () => {
    const { data: reValidate }: any = await axios.post(NEXT_BASKET_VALIDATE, {
      basketId: basketId,
    })

    setBasketReValidate({ ...reValidate?.result, message: reValidate?.result?.messageCode })
    return reValidate?.result
  }
  const handleLoadAsync = async (preferredPaymentMethod: any) => {
    const promises = new Array<Promise<any>>()
    promises.push(
      await new Promise<any>(async (resolve: any, reject: any) => {
        await fetchBasketReValidate()
        resolve()
      })
    )
    Promise.all(promises)
  }
  useEffect(() => {
    async function loadShippingPlans() {
      await fetchShippingPlans([])
    }

    if (cart?.shippingMethods?.length > 0) {
      loadShippingPlans()
    } else {
      setCartItems(cart)
    }
  }, [])

  const openModal = () => {
    setIsOpen(true)
  }

  const isIncludeVAT = vatIncluded()
  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const [userCartItems, setUserCartItems] = useState<any>(null)
  useEffect(() => {
    let items = sortBy(cartItems?.lineItems, 'displayOrder')
    items = Object.values(groupCartItemsById(cartItems?.lineItems))
    setUserCartItems(items)
  }, [cartItems?.lineItems])
  return (
    <>
      {!isEmpty && !isSplitDelivery && (
        <section aria-labelledby="cart-heading" className={`flex flex-col w-full pr-1 basket-cart-items`}>
          {userCartItems?.map((product: any, productIdx: number) => {
            let soldOutMessage = ''
            const saving = (isIncludeVAT ? product?.listPrice?.raw?.withTax : product?.listPrice?.raw?.withoutTax) - (isIncludeVAT ? product?.price?.raw?.withTax : product?.price?.raw?.withoutTax)
            const discount = round((saving / (isIncludeVAT ? product?.listPrice?.raw?.withTax : product?.listPrice?.raw?.withoutTax)) * 100, 0)
            soldOutMessage = getCartValidateMessages(reValidateData?.messageCode, product)
            const voltageAttr: any = tryParseJson(product?.attributesJson)
            const electricVoltAttrLength = voltageAttr?.Attributes?.filter((x: any) => x?.FieldCode == 'electrical.voltage')
            let productNameWithVoltageAttr: any = product?.name
            productNameWithVoltageAttr = electricVoltAttrLength?.length > 0 ? electricVoltAttrLength?.map((volt: any, vId: number) => (
              <span key={`voltage-${vId}`}>
                {product?.name?.toLowerCase()}{' '}
                <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
                  {volt?.ValueText}
                </span>
              </span>
            )) : (productNameWithVoltageAttr = product?.name)

            if (product?.length) {
              soldOutMessage = getCartValidateMessages(reValidateData?.messageCode, product)
              const voltageAttr: any = tryParseJson(product?.attributesJson)
              const electricVoltAttrLength = voltageAttr?.Attributes?.filter((x: any) => x?.FieldCode == 'electrical.voltage')
              let productNameWithVoltageAttr: any = product?.name
              productNameWithVoltageAttr = electricVoltAttrLength?.length > 0 ? electricVoltAttrLength?.map((volt: any, vId: number) => (
                <span key={`voltage-${vId}`}>
                  {product?.name?.toLowerCase()}{' '}
                  <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
                    {volt?.ValueText}
                  </span>
                </span>
              )) : (productNameWithVoltageAttr = product?.name)
              if (product?.length) {
                return (
                  <div key={product?.productId}>
                    <BasketGroupProduct products={product} closeSidebar={closeSidebar} openModal={openModal} setItemClicked={setItemClicked} />
                  </div>
                )
              }
              return (
                <div key={product?.productId}>
                  <BasketGroupProduct products={product} closeSidebar={closeSidebar} openModal={openModal} setItemClicked={setItemClicked} />
                </div>
              )
            }
            return (
              <>
                <div key={product?.id} className={`w-full px-2 py-2 mb-2 border rounded items-list ${product?.price?.raw?.withTax > 0 ? 'bg-white' : 'bg-emerald-50 border-emerald-400'}`}>
                  <div className='grid grid-cols-12 gap-2'>
                    <div className='col-span-3 img-container'>
                      <img width={120} height={150} src={`${product?.image}` || IMG_PLACEHOLDER} alt={product?.name} className="object-cover object-center w-32 image" />
                    </div>
                    <div className='col-span-9'>
                      <h6 className="font-light text-black">{productNameWithVoltageAttr}</h6>
                      <div className="flex items-center justify-between w-full my-2 gap-y-3">
                        <div className='justify-start text-left'>
                          {product?.price?.raw?.withTax > 0 ?
                            <>
                              <span className="block font-semibold text-black font-14">
                                {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
                                {product?.listPrice?.raw.withTax > 0 && product?.listPrice?.raw.withTax != product?.price?.raw?.withTax ? (
                                  <span className="pl-2 font-normal text-gray-400 line-through font-14">
                                    {' '}{isIncludeVAT ? product?.listPrice.formatted?.withTax : product?.listPrice.formatted?.withoutTax}
                                  </span>
                                ) : null}
                                <span className="pl-2 font-light text-black font-12">
                                  {isIncludeVAT ? 'inc.' : 'excl.'} VAT
                                </span>
                              </span>
                            </> :
                            <>
                              <span className='flex flex-col font-semibold text-red-500'>FREE</span>
                            </>
                          }
                        </div>
                        <div className='justify-end'><span className='flex flex-col font-semibold text-black'>Qty: {product?.qty}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }
          )}
        </section>
      )}
      {!isEmpty && isSplitDelivery && splitBasketProducts && (
        <section aria-labelledby="cart-heading" className={`flex flex-col w-full pr-1 basket-cart-items`}>
          <div className='w-full divide-y divide-slate-200 dark:divide-slate-700'>
            {Object.entries(splitBasketProducts)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([deliveryDate, products]: any, index: number) => (
                <div key={deliveryDate}>
                  {/* Delivery Header */}
                  <h2 className="py-3 text-sm font-semibold">
                    {translate('label.checkout.deliveryText', { index: index + 1 })} {index + 1} of {Object.keys(splitBasketProducts)?.length} - {deliveryDate}
                  </h2>

                  {/* Loop through Products */}
                  {products?.map((product: any, productIdx: number) => {
                    let soldOutMessage = ''
                    const saving = (isIncludeVAT ? product?.listPrice?.raw?.withTax : product?.listPrice?.raw?.withoutTax) - (isIncludeVAT ? product?.price?.raw?.withTax : product?.price?.raw?.withoutTax)
                    const discount = round((saving / (isIncludeVAT ? product?.listPrice?.raw?.withTax : product?.listPrice?.raw?.withoutTax)) * 100, 0)
                    soldOutMessage = getCartValidateMessages(reValidateData?.messageCode, product)
                    const voltageAttr: any = tryParseJson(product?.attributesJson)
                    const electricVoltAttrLength = voltageAttr?.Attributes?.filter(
                      (x: any) => x?.FieldCode == 'electrical.voltage'
                    )
                    let productNameWithVoltageAttr: any = product?.name
                    productNameWithVoltageAttr = electricVoltAttrLength?.length > 0 ? electricVoltAttrLength?.map((volt: any, vId: number) => (
                      <span key={`voltage-${vId}`}>
                        {product?.name?.toLowerCase()}{' '}
                        <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded"> {volt?.ValueText} </span>
                      </span>
                    )) : <span>{product?.name}</span>
                    if (product?.length) {
                      return (
                        <div className='checkout-summary' key={`summary-${product?.productId}`}>
                          <BasketGroupProduct key={product?.productId} products={product} checkoutItem={true} />
                        </div>
                      )
                    }
                    return (
                      <>
                        <div key={product?.id} className={`w-full px-2 py-2 mb-2 border rounded items-list ${product?.price?.raw?.withTax > 0 ? 'bg-white' : 'bg-emerald-50 border-emerald-400'}`}>
                          <div className='grid grid-cols-12 gap-2'>
                            <div className='col-span-2 img-container'>
                              <img width={120} height={150} src={`${product?.image}` || IMG_PLACEHOLDER} alt={product?.name} className="object-cover object-center w-32 image" />
                            </div>
                            <div className='col-span-10'>
                              <h6 className="text-sm font-light text-black">{productNameWithVoltageAttr}</h6>
                              <div className="flex items-center justify-between w-full my-2 gap-y-3">
                                <div className='justify-start text-left'>
                                  {product?.price?.raw?.withTax > 0 ?
                                    <>
                                      <span className="block font-semibold text-black font-14">
                                        {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
                                        {product?.listPrice?.raw.withTax > 0 && product?.listPrice?.raw.withTax != product?.price?.raw?.withTax ? (
                                          <span className="pl-2 font-normal text-gray-400 line-through font-14">
                                            {' '}{isIncludeVAT ? product?.listPrice.formatted?.withTax : product?.listPrice.formatted?.withoutTax}
                                          </span>
                                        ) : null}
                                        <span className="pl-2 font-light text-black font-12">
                                          {isIncludeVAT ? 'inc.' : 'excl.'} VAT
                                        </span>
                                      </span>
                                    </> :
                                    <>
                                      <span className='flex flex-col font-semibold text-red-500'>FREE</span>
                                    </>
                                  }
                                </div>
                                <div className='justify-end'><span className='flex flex-col font-semibold text-black'>Qty: {product?.qty}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  )
}

export default SplitDeliveryBasketItems