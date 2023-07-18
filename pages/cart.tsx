import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/solid'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import {
  PlusSmallIcon,
  MinusSmallIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
const PromotionInput = dynamic(
  () => import('../components/cart/PromotionInput')
)
import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Disclosure, Transition } from '@headlessui/react'
import { getShippingPlans } from '@framework/shipping'
import {
  BTN_CHECKOUT_NOW,
  BTN_PLACE_ORDER,
  GENERAL_CATALOG,
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_REMOVE,
  GENERAL_SHIPPING,
  GENERAL_SHOPPING_CART,
  GENERAL_TAX,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_EXCLUDING_TAX,
  SUBTOTAL_INCLUDING_TAX,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { tryParseJson } from '@framework/utils/parse-util'
import SizeChangeModal from '@components/cart/SizeChange'
import {
  getCurrentPage,
  validateAddToCart,
  vatIncluded,
} from '@framework/utils/app-util'
import {
  NEXT_BASKET_VALIDATE,
  NEXT_GET_ALT_RELATED_PRODUCTS,
  NEXT_GET_BASKET_PROMOS,
  NEXT_GET_ORDER_RELATED_PRODUCTS,
  NEXT_SHIPPING_PLANS,
  SITE_NAME,
  SITE_ORIGIN_URL,
  collectionSlug,
} from '@components/utils/constants'
import { useRouter } from 'next/router'
import RelatedProductWithGroup from '@components/product/RelatedProducts/RelatedProductWithGroup'
import SplitDelivery from '@components/checkout/SplitDelivery'
import { LoadingDots } from '@components/ui'
import { Guid } from '@commerce/types'
import { stringToBoolean } from '@framework/utils/parse-util'
function Cart({ cart, deviceInfo, maxBasketItemsCount, config }: any) {
  const allowSplitShipping = stringToBoolean(
    config?.configSettings
      ?.find((x: any) => x.configType === 'OrderSettings')
      ?.configKeys?.find(
        (x: any) => x.key === 'OrderSettings.AllowCustometToSplitShipping'
      )?.value || ''
  )

  const {
    setCartItems,
    cartItems,
    basketId,
    setIsSplitDelivery,
    isSplitDelivery,
  } = useUI()
  const { addToCart } = cartHandler()
  const [isGetBasketPromoRunning, setIsGetBasketPromoRunning] = useState(false)
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  const [altRelatedProducts, setAltRelatedProducts] = useState<any>()
  const [relatedProducts, setRelatedProducts] = useState<any>()
  const [splitDeliveryItems, setSplitDeliveryItems] = useState<any>(null)
  const [splitDeliveryDates, setSplitDeliveryDates] = useState<any>(null)
  const [splitBasketProducts, setSplitBasketProducts] = useState<any>({})
  const [selectedProductOnSizeChange, setSelectedProductOnSizeChange] =
    useState(null)
  const [basketPromos, setBasketPromos] = useState<Array<any> | undefined>(
    undefined
  )
  const [reValidateData, setBasketReValidate] = useState<any>([])
  const getBasketPromos = async (basketId: string) => {
    const { data: basketPromos } = await axios.get(NEXT_GET_BASKET_PROMOS, {
      params: { basketId: basketId },
    })
    setBasketPromos(basketPromos)
    return basketPromos
  }
  const handleToggleOpenSizeChangeModal = async (product?: any) => {
    // toggle open/close modal
    setOpenSizeChangeModal(!openSizeChangeModal)

    if (product) {
      // on open modal
      setSelectedProductOnSizeChange(product)
    } else {
      // on close modal
      setSelectedProductOnSizeChange(null)
    }
  }
  let firstProductId = ''
  if (cartItems?.lineItems?.length > 0) {
    firstProductId = cartItems?.lineItems?.length
      ? cartItems?.lineItems?.filter((x: any, idx: number) => idx == 0)[0]
          ?.productId
      : ''
  }

  const fetchRelatedProducts = async (productId?: string) => {
    const { data: relatedProducts }: any = await axios.post(
      NEXT_GET_ORDER_RELATED_PRODUCTS,
      {
        recordId: firstProductId,
      }
    )

    setRelatedProducts(relatedProducts)
  }
  const handleLoadAsync = async (preferredPaymentMethod: any) => {
    const promises = new Array<Promise<any>>()

    // promises.push(await new Promise<any>(async (resolve: any, reject: any) => {
    //   await handleFetchUPIs(preferredPaymentMethod);
    //   resolve();
    // }));

    // promises.push(await new Promise<any>(async (resolve: any, reject: any) => {
    //   await handleFetchCards(preferredPaymentMethod);
    //   resolve();
    // }));

    /*promises.push(await new Promise<any>(async (resolve: any, rejec: any) => {
      await getBasketPromos(cartItems?.id);
      resolve();
    }));*/

    promises.push(
      await new Promise<any>(async (resolve: any, rejec: any) => {
        if (cartItems?.lineItems?.length) {
          const lastItemProductId =
            cartItems?.lineItems[cartItems?.lineItems?.length - 1]?.productId
          await fetchRelatedProducts(lastItemProductId)
        }
        resolve()
      })
    )

    promises.push(
      await new Promise<any>(async (resolve: any, rejec: any) => {
        await fetchBasketReValidate()
        resolve()
      })
    )

    promises.push(
      await new Promise<any>(async (resolve: any, rejec: any) => {
        await getAlltrelatedProducts()
        resolve()
      })
    )

    Promise.all(promises)
  }
  const getAlltrelatedProducts = async () => {
    const { data: altRelatedProducts }: any = await axios.post(
      NEXT_GET_ALT_RELATED_PRODUCTS,
      {
        slug: collectionSlug,
      }
    )
    setAltRelatedProducts(altRelatedProducts)
  }

  useEffect(() => {
    let splitProducts = groupItemsByDeliveryDate(cartItems?.lineItems)
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
        let deliveryDateTarget = obj.Items?.find(
          (item: any) =>
            item.ProductId?.toLowerCase() === cartItem.productId.toLowerCase()
        )?.DeliveryDateTarget
        let shippingSpeed = obj.Items?.find(
          (item: any) =>
            item.ProductId?.toLowerCase() === cartItem.productId.toLowerCase()
        )?.ShippingSpeed
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
    const shippingMethodItem: any = cart.shippingMethods.find(
      (method: any) => method.id === cart.shippingMethodId
    )

    const model = {
      BasketId: basketId,
      OrderId: Guid.empty,
      PostCode: cartItems?.postCode || '',
      ShippingMethodType: shippingMethodItem.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem.displayName,
      ShippingMethodCode: shippingMethodItem.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item.id),
          OrderLineRecordId: Guid.empty,
          ProductId: item.productId,
          ParentProductId: item.parentProductId,
          StockCode: item.stockCode,
          Qty: item.qty,
          PoolCode: item.poolCode || null,
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
      ShippingMethodType: shippingMethodItem.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem.displayName,
      ShippingMethodCode: shippingMethodItem.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item.id),
          OrderLineRecordId: Guid.empty,
          ProductId: item.productId,
          ParentProductId: item.parentProductId,
          StockCode: item.stockCode,
          Qty: item.qty,
          PoolCode: item.poolCode || null,
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
    // const shippingPlans = await getShippingPlans()({ model: model })
    if (shippingPlans.length > 1) {
      setIsSplitDelivery(true)
      splitDeliveryExtract(
        mapSplitDeliveryPlansToItems(shippingPlans || [], items.lineItems) //cart
      )

      setCartItems({
        ...items, //cart
        lineItems: mapSplitDeliveryPlansToItems(
          shippingPlans || [],
          items.lineItems
        ),
      })
    } else {
      setIsSplitDelivery(false)
      setCartItems({
        ...cart,
        lineItems: mapShippingPlansToItems(shippingPlans || [], cart.lineItems),
      })
    }
  }
  const fetchBasketReValidate = async () => {
    const { data: reValidate }: any = await axios.post(NEXT_BASKET_VALIDATE, {
      basketId: basketId,
    })

    setBasketReValidate(reValidate?.result)
    return reValidate?.result
  }

  useEffect(() => {
    const handleAsync = async () => {
      const promise = await new Promise<any>(
        async (resolve: any, reject: any) => {
          await getBasketPromos(basketId)
          await fetchBasketReValidate()
          setIsGetBasketPromoRunning(!isGetBasketPromoRunning)
          if (cartItems?.lineItems?.length) {
            const lastItemProductId =
              cartItems?.lineItems[cartItems?.lineItems?.length - 1]?.productId
            await fetchRelatedProducts(lastItemProductId)
          }
          resolve()
        }
      )

      Promise.resolve(promise)
    }

    // [GS, 07-12-2022]: Idea is to disallow multiple get basket promos calls to instantiate in the same lifecycle event.
    if (!isGetBasketPromoRunning) {
      setIsGetBasketPromoRunning(true)
      handleAsync()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketId, cartItems])
  useEffect(() => {
    async function loadShippingPlans() {
      await fetchShippingPlans([])
    }

    if (cart?.shippingMethods.length > 0) {
      loadShippingPlans()
    } else {
      setCartItems(cart)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      let data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
        userCart.lineItems = userCart.lineItems.filter(
          (item: { id: any }) => item.id !== product.id
        )
      }
      try {
        const item = await addToCart(data)
        if (isSplitDelivery) {
          setCartItems(item)
          fetchShippingPlans(item)
        } else {
          setCartItems(item)
        }
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }
  const isIncludeVAT = vatIncluded()
  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0
  const css = { maxWidth: '100%', height: 'auto' }
  const router = useRouter()
  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link
          rel="canonical"
          id="canonical"
          href="https://demostore.bettercommerce.io/cart"
        />
        <title>Basket</title>
        <meta name="title" content="Basket" />
        <meta name="description" content="Basket" />
        <meta name="keywords" content="Basket" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Basket" key="ogtitle" />
        <meta property="og:description" content="Basket" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta
          property="og:url"
          content={absPath || SITE_ORIGIN_URL + router.asPath}
          key="ogurl"
        />
      </NextHead>
      <div className="container w-full px-4 mx-auto mt-6 mb-10 bg-white sm:px-6 sm:mt-10">
        <h1 className="relative flex items-baseline font-semibold tracking-tighter text-black uppercase">
          {GENERAL_SHOPPING_CART}{' '}
          <span className="pl-2 text-sm font-normal tracking-normal text-gray-400 top-2">
            {userCart?.lineItems?.length}{' '}
            {userCart?.lineItems?.length > 1 ? 'Items' : 'Item'} added
          </span>
        </h1>
        {!isEmpty && !isSplitDelivery && (
          <>
            {JSON.stringify(altRelatedProducts)}
            <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                {userCart.lineItems?.map((product: any, productIdx: number) => (
                  <div
                    key={productIdx}
                    className="flex p-2 mb-2 border border-gray-200 rounded-md sm:p-3"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        style={css}
                        width={140}
                        height={180}
                        src={
                          generateUri(product.image, 'h=200&fm=webp') ||
                          IMG_PLACEHOLDER
                        }
                        alt={product.name}
                        className="object-cover object-center w-16 rounded-lg sm:w-28 image"
                      />
                    </div>
                    <div className="relative flex flex-col flex-1 w-full gap-0 ml-4 sm:ml-6">
                      <h3 className="py-0 text-xs font-normal text-black sm:py-0 sm:text-xs">
                        {product.brand}
                      </h3>
                      <h3 className="my-2 text-sm sm:text-sm sm:my-1">
                        <Link href={`/${product.slug}`}>
                          <span className="font-normal text-gray-700 hover:text-gray-800">
                            {product.name}
                          </span>
                        </Link>
                      </h3>
                      <div className="mt-0 font-bold text-black text-md sm:font-semibold">
                        {isIncludeVAT
                          ? product.price?.formatted?.withTax
                          : product.price?.formatted?.withoutTax}
                        {product.listPrice?.raw.withTax > 0 &&
                        product.listPrice?.raw.withTax !=
                          product.price?.raw?.withTax ? (
                          <span className="px-2 text-sm text-red-400 line-through">
                            {GENERAL_PRICE_LABEL_RRP}{' '}
                            {isIncludeVAT
                              ? product.listPrice.formatted?.withTax
                              : product.listPrice.formatted?.withoutTax}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                        {product?.variantProducts?.length > 0 ? (
                          <div
                            role="button"
                            onClick={handleToggleOpenSizeChangeModal.bind(
                              null,
                              product
                            )}
                          >
                            <div className="border w-[fit-content] flex items-center mt-3 py-2 px-2">
                              <div className="mr-1 text-sm text-gray-700">
                                Size:{' '}
                                <span className="font-semibold text-black uppercase">
                                  {getLineItemSizeWithoutSlug(product)}
                                </span>
                              </div>
                              <ChevronDownIcon className="w-4 h-4 text-black" />
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <div className="flex items-center justify-around px-2 text-gray-900 border sm:px-4">
                          <MinusSmallIcon
                            onClick={() => handleItem(product, 'decrease')}
                            className="w-4 cursor-pointer"
                          />
                          <span className="px-4 py-2 text-md sm:py-2">
                            {product.qty}
                          </span>
                          <PlusSmallIcon
                            className="w-4 cursor-pointer"
                            onClick={() => handleItem(product, 'increase')}
                          />
                        </div>
                      </div>

                      {product.children?.map((child: any, idx: number) => (
                        <div className="flex mt-10" key={'child' + idx}>
                          <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-md">
                            <Image
                              src={child.image}
                              alt={child.name}
                              className="object-cover object-center w-full h-full"
                            />
                          </div>
                          <div className="flex justify-between ml-5 font-medium text-gray-900">
                            <Link href={`/${child.slug}`}>{child.name}</Link>
                            <p className="ml-4">
                              {child.price?.formatted?.withTax > 0
                                ? isIncludeVAT
                                  ? child.price?.formatted?.withTax
                                  : child.price?.formatted?.withoutTax
                                : ''}
                            </p>
                          </div>
                          {!child.parentProductId ? (
                            <div className="flex items-center justify-end flex-1 text-sm">
                              <button
                                type="button"
                                onClick={() => handleItem(child, 'delete')}
                                className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500"
                              >
                                <span className="sr-only">
                                  {GENERAL_REMOVE}
                                </span>
                                <TrashIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-row px-2 pl-2 pr-0 text-gray-900 border sm:px-4 text-md sm:py-2 sm:pr-9">
                              {child.qty}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          onClick={() => handleItem(product, 'delete')}
                          className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">{GENERAL_REMOVE}</span>
                          <TrashIcon
                            className="w-4 h-4 mt-2 text-red-500 sm:h-5 sm:w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div className="flex flex-col pt-3 text-xs font-bold text-gray-700 sm:hidden sm:text-sm">
                        {product.shippingPlan?.shippingSpeed}
                      </div>
                    </div>
                  </div>
                ))}
                {/* <section>
                  {splitDeliveryItems && (
                    <SplitDelivery
                      splitDeliveryItems={splitDeliveryItems}
                      showDeliveryOptions={false}
                    />
                  )}
                </section> */}
              </section>
              <section
                aria-labelledby="summary-heading"
                className="px-4 py-0 mt-4 bg-white rounded-sm md:sticky top-20 sm:mt-0 sm:px-6 lg:px-6 lg:mt-0 lg:col-span-5"
              >
                <h4
                  id="summary-heading"
                  className="mb-1 font-semibold text-black uppercase"
                >
                  {GENERAL_ORDER_SUMMARY}
                </h4>
                <div className="mt-4 lg:-mb-3">
                  <PromotionInput
                    basketPromos={basketPromos}
                    items={cartItems}
                    getBasketPromoses={getBasketPromos}
                  />
                </div>
                <dl className="mt-6 space-y-2 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">
                      {isIncludeVAT
                        ? SUBTOTAL_INCLUDING_TAX
                        : SUBTOTAL_EXCLUDING_TAX}
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT
                        ? cartItems.subTotal?.formatted?.withTax
                        : cartItems.subTotal?.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{GENERAL_SHIPPING}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT
                        ? cartItems.shippingCharge?.formatted?.withTax
                        : cartItems.shippingCharge?.formatted?.withoutTax}
                    </dd>
                  </div>
                  {userCart.promotionsApplied?.length > 0 && (
                    <div className="flex items-center justify-between pt-2 sm:pt-2">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{GENERAL_DISCOUNT}</span>
                      </dt>
                      <dd className="font-semibold text-red-500 text-md">
                        <p>
                          {'-'}
                          {isIncludeVAT
                            ? cartItems.discount?.formatted?.withTax
                            : cartItems.discount?.formatted?.withoutTax}
                        </p>
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{GENERAL_TAX}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {cartItems.grandTotal?.formatted?.tax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-gray-900 border-t">
                    <dt className="text-lg font-bold text-black">
                      {GENERAL_TOTAL}
                    </dt>
                    <dd className="text-xl font-bold text-black">
                      {isIncludeVAT
                        ? cartItems.grandTotal?.formatted?.withTax
                        : cartItems.grandTotal?.formatted?.withTax}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <Link href="/checkout">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 font-medium text-center text-white uppercase btn-primary"
                    >
                      {BTN_PLACE_ORDER}
                    </button>
                  </Link>
                </div>
              </section>
            </div>
            <div>
              {altRelatedProducts?.relatedProducts && (
                <div className="flex flex-col px-4 pb-10 mt-0 sm:px-8 sm:pb-16 cart-related-prod ">
                  <RelatedProductWithGroup
                    products={
                      altRelatedProducts?.relatedProducts?.products?.results ||
                      []
                    }
                    productPerColumn={1.7}
                    deviceInfo={deviceInfo}
                    maxBasketItemsCount={maxBasketItemsCount}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {!isEmpty && isSplitDelivery && splitBasketProducts && (
          <>
            <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                {Object.keys(splitBasketProducts)?.map(
                  (deliveryDate: any, Idx: any) => (
                    <>
                      {Object.keys(splitBasketProducts)[0] ===
                      'Invalid Date' ? (
                        <LoadingDots />
                      ) : (
                        <h2 className="text-sm font-bold">
                          {`Delivery ${Idx + 1}`}
                        </h2>
                      )}
                      {splitBasketProducts[deliveryDate]?.map(
                        (product: any, productIdx: number) => (
                          <div
                            key={productIdx}
                            className="flex p-2 mb-2 border border-gray-200 rounded-md sm:p-3"
                          >
                            <div className="flex-shrink-0">
                              <Image
                                style={css}
                                width={140}
                                height={180}
                                src={
                                  generateUri(product.image, 'h=200&fm=webp') ||
                                  IMG_PLACEHOLDER
                                }
                                alt={product.name}
                                className="object-cover object-center w-16 rounded-lg sm:w-28 image"
                              />
                            </div>
                            <div className="relative flex flex-col flex-1 w-full gap-0 ml-4 sm:ml-6">
                              <h3 className="py-0 text-xs font-normal text-black sm:py-0 sm:text-xs">
                                {product.brand}
                              </h3>
                              <h3 className="my-2 text-sm sm:text-sm sm:my-1">
                                <Link href={`/${product.slug}`}>
                                  <span className="font-normal text-gray-700 hover:text-gray-800">
                                    {product.name}
                                  </span>
                                </Link>
                              </h3>
                              <div className="mt-0 font-bold text-black text-md sm:font-semibold">
                                {isIncludeVAT
                                  ? product.price?.formatted?.withTax
                                  : product.price?.formatted?.withoutTax}
                                {product.listPrice?.raw.withTax > 0 &&
                                product.listPrice?.raw.withTax !=
                                  product.price?.raw?.withTax ? (
                                  <span className="px-2 text-sm text-red-400 line-through">
                                    {GENERAL_PRICE_LABEL_RRP}{' '}
                                    {isIncludeVAT
                                      ? product.listPrice.formatted?.withTax
                                      : product.listPrice.formatted?.withoutTax}
                                  </span>
                                ) : null}
                              </div>
                              <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                                {product?.variantProducts?.length > 0 ? (
                                  <div
                                    role="button"
                                    onClick={handleToggleOpenSizeChangeModal.bind(
                                      null,
                                      product
                                    )}
                                  >
                                    <div className="border w-[fit-content] flex items-center mt-3 py-2 px-2">
                                      <div className="mr-1 text-sm text-gray-700">
                                        Size:{' '}
                                        <span className="font-semibold text-black uppercase">
                                          {getLineItemSizeWithoutSlug(product)}
                                        </span>
                                      </div>
                                      <ChevronDownIcon className="w-4 h-4 text-black" />
                                    </div>
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {isSplitDelivery && splitDeliveryDates && (
                                  <p className="w-full">
                                    {product?.shippingSpeed}
                                  </p>
                                )}
                                <div className="flex items-center justify-around px-2 text-gray-900 border sm:px-4">
                                  <MinusSmallIcon
                                    onClick={() =>
                                      handleItem(product, 'decrease')
                                    }
                                    className="w-4 cursor-pointer"
                                  />
                                  <span className="px-4 py-2 text-md sm:py-2">
                                    {product.qty}
                                  </span>
                                  <PlusSmallIcon
                                    className="w-4 cursor-pointer"
                                    onClick={() =>
                                      handleItem(product, 'increase')
                                    }
                                  />
                                </div>
                              </div>

                              {product.children?.map(
                                (child: any, idx: number) => (
                                  <div
                                    className="flex mt-10"
                                    key={'child' + idx}
                                  >
                                    <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-md">
                                      <Image
                                        src={child.image}
                                        alt={child.name}
                                        className="object-cover object-center w-full h-full"
                                      />
                                    </div>
                                    <div className="flex justify-between ml-5 font-medium text-gray-900">
                                      <Link href={`/${child.slug}`}>
                                        {child.name}
                                      </Link>
                                      <p className="ml-4">
                                        {child.price?.formatted?.withTax > 0
                                          ? isIncludeVAT
                                            ? child.price?.formatted?.withTax
                                            : child.price?.formatted?.withoutTax
                                          : ''}
                                      </p>
                                    </div>
                                    {!child.parentProductId ? (
                                      <div className="flex items-center justify-end flex-1 text-sm">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleItem(child, 'delete')
                                          }
                                          className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500"
                                        >
                                          <span className="sr-only">
                                            {GENERAL_REMOVE}
                                          </span>
                                          <TrashIcon
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex flex-row px-2 pl-2 pr-0 text-gray-900 border sm:px-4 text-md sm:py-2 sm:pr-9">
                                        {child.qty}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                              <div className="absolute top-0 right-0">
                                <button
                                  type="button"
                                  onClick={() => handleItem(product, 'delete')}
                                  className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500"
                                >
                                  <span className="sr-only">
                                    {GENERAL_REMOVE}
                                  </span>
                                  <TrashIcon
                                    className="w-4 h-4 mt-2 text-red-500 sm:h-5 sm:w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                              <div className="flex flex-col pt-3 text-xs font-bold text-gray-700 sm:hidden sm:text-sm">
                                {product.shippingPlan?.shippingSpeed}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )
                )}
              </section>
              <section
                aria-labelledby="summary-heading"
                className="px-4 py-0 mt-4 bg-white rounded-sm md:sticky top-20 sm:mt-0 sm:px-6 lg:px-6 lg:mt-0 lg:col-span-5"
              >
                <h4
                  id="summary-heading"
                  className="mb-1 font-semibold text-black uppercase"
                >
                  {GENERAL_ORDER_SUMMARY}
                </h4>
                <div className="mt-4 lg:-mb-3">
                  <PromotionInput
                    basketPromos={basketPromos}
                    items={cartItems}
                    getBasketPromoses={getBasketPromos}
                  />
                </div>
                <dl className="mt-6 space-y-2 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">
                      {isIncludeVAT
                        ? SUBTOTAL_INCLUDING_TAX
                        : SUBTOTAL_EXCLUDING_TAX}
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT
                        ? cartItems.subTotal?.formatted?.withTax
                        : cartItems.subTotal?.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{GENERAL_SHIPPING}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT
                        ? cartItems.shippingCharge?.formatted?.withTax
                        : cartItems.shippingCharge?.formatted?.withoutTax}
                    </dd>
                  </div>
                  {userCart.promotionsApplied?.length > 0 && (
                    <div className="flex items-center justify-between pt-2 sm:pt-2">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{GENERAL_DISCOUNT}</span>
                      </dt>
                      <dd className="font-semibold text-red-500 text-md">
                        <p>
                          {'-'}
                          {isIncludeVAT
                            ? cartItems.discount?.formatted?.withTax
                            : cartItems.discount?.formatted?.withoutTax}
                        </p>
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{GENERAL_TAX}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {cartItems.grandTotal?.formatted?.tax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-gray-900 border-t">
                    <dt className="text-lg font-bold text-black">
                      {GENERAL_TOTAL}
                    </dt>
                    <dd className="text-xl font-bold text-black">
                      {isIncludeVAT
                        ? cartItems.grandTotal?.formatted?.withTax
                        : cartItems.grandTotal?.formatted?.withTax}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <Link href="/checkout">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 font-medium text-center text-white uppercase btn-primary"
                    >
                      {BTN_PLACE_ORDER}
                    </button>
                  </Link>
                </div>
              </section>
            </div>
            <div>
              {altRelatedProducts?.relatedProducts && (
                <div className="flex flex-col px-4 pb-10 mt-0 sm:px-8 sm:pb-16 cart-related-prod ">
                  <RelatedProductWithGroup
                    products={
                      altRelatedProducts?.relatedProducts?.products?.results ||
                      []
                    }
                    productPerColumn={1.7}
                    deviceInfo={deviceInfo}
                    maxBasketItemsCount={maxBasketItemsCount}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center w-full h-full py-10 text-gray-900">
            Uh-oh, you don't have any items in here
            <Link href="/search">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {GENERAL_CATALOG}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        )}
        <SizeChangeModal
          open={openSizeChangeModal}
          handleToggleOpen={handleToggleOpenSizeChangeModal}
          product={selectedProductOnSizeChange}
        />
      </div>
    </>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketRef: any = cookies.basketId
  if (!basketRef) {
    basketRef = basketIdGenerator()
    context.res.setHeader('set-cookie', `basketId=${basketRef}`)
  }

  const response = await getCart()({
    basketId: basketRef,
    cookies: context.req.cookies,
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
