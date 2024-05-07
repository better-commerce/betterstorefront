// Base Imports
import { useEffect, useMemo, useState } from 'react'

// Package Imports
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import MembershipOfferCard from '@components/membership/MembershipOfferCard'
import OptMembershipModal from '@components/membership/OptMembershipModal'

// Component Imports
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import { basketId as basketIdGenerator } from '@components/ui/context'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmallIcon, MinusSmallIcon, ChevronDownIcon, TrashIcon, MinusIcon, PlusIcon, NoSymbolIcon, CheckIcon } from '@heroicons/react/24/outline'
import { LoadingDots } from '@components/ui'
import { generateUri } from '@commerce/utils/uri-util'
import { matchStrings, parseItemId, stringToNumber, tryParseJson } from '@framework/utils/parse-util'
import SizeChangeModal from '@components/SectionCheckoutJourney/cart/SizeChange'
import { vatIncluded, } from '@framework/utils/app-util'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString, EmptyGuid, LoadingActionType, NEXT_BASKET_VALIDATE, NEXT_GET_ALT_RELATED_PRODUCTS, NEXT_GET_BASKET_PROMOS, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_SHIPPING_PLANS, SITE_NAME, SITE_ORIGIN_URL, collectionSlug, EmptyObject, NEXT_MEMBERSHIP_BENEFITS, CURRENT_THEME } from '@components/utils/constants'
import RelatedProductWithGroup from '@components/Product/RelatedProducts/RelatedProductWithGroup'
import { Guid } from '@commerce/types'
import { stringToBoolean } from '@framework/utils/parse-util'
import CartItemRemoveModal from '@components/CartItemRemoveModal'
import { useTranslation } from '@commerce/utils/use-translation'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PromotionInput from '@components/SectionCheckoutJourney/cart/PromotionInput'
import CartItems from '@components/SectionCheckoutJourney/checkout/CartItem'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'

function Cart({ cart, deviceInfo, maxBasketItemsCount, config, allMembershipPlans, defaultDisplayMembership, featureToggle }: any) {
  const allowSplitShipping = stringToBoolean(
    config?.configSettings
      ?.find((x: any) => x.configType === 'DomainSettings')
      ?.configKeys?.find(
        (x: any) => x.key === "DomainSettings.EnableOmniOms"
      )?.value || ''
  ) && stringToBoolean(
    config?.configSettings
      ?.find((x: any) => x.configType === 'OrderSettings')
      ?.configKeys?.find(
        (x: any) => x.key === "OrderSettings.EnabledPartialDelivery"
      )?.value || ''
  )

  const { setCartItems, cartItems, basketId, isGuestUser, user, setIsSplitDelivery, isSplitDelivery, } = useUI()
  const { addToCart, getCart } = cartHandler()
  const translate = useTranslation()
  const [isGetBasketPromoRunning, setIsGetBasketPromoRunning] = useState(false)
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  const [altRelatedProducts, setAltRelatedProducts] = useState<any>()
  const [relatedProducts, setRelatedProducts] = useState<any>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [splitDeliveryItems, setSplitDeliveryItems] = useState<any>(null)
  const [splitDeliveryDates, setSplitDeliveryDates] = useState<any>(null)
  const [splitBasketProducts, setSplitBasketProducts] = useState<any>({})
  const [basket, setBasket] = useState(cart)
  const [membership, setMembership] = useState([])
  const [selectedProductOnSizeChange, setSelectedProductOnSizeChange] =
    useState(null)
  const [openOMM, setOpenOMM] = useState(false)
  const [basketPromos, setBasketPromos] = useState<Array<any> | undefined>(
    undefined
  )
  const [reValidateData, setBasketReValidate] = useState<any>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [itemClicked, setItemClicked] = useState<any | Array<any>>()
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


  const getBasket = async (basketId: string) => {
    const basketResult: any = await getCart({
      basketId,
    })
    const isLoggedIn = (user?.userId && user?.userId !== EmptyGuid && !isGuestUser) || false
    setIsLoggedIn(isLoggedIn)
    return basketResult
  }

  const refreshBasket = async () => {
    const basketId = basket?.id
    if (basketId && basketId != Guid.empty) {
      const basketResult = await getBasket(basketId)
      if (basketResult) {
        setBasket(basketResult)
        setCartItems(basketResult)
      }
    }
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
    if (shippingPlans.length > 1 && allowSplitShipping) {
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

    setBasketReValidate({ ...reValidate?.result, message: reValidate?.result?.messageCode })
    return reValidate?.result
  }

  useEffect(() => {
    async function fetchMembership() {
      const membershipItem = basket?.lineItems?.find((x: any) => x?.isMembership)
      const userId = membershipItem ? null : user?.userId !== Guid.empty ? user?.userId : null
      const data = { userId, basketId: basket?.id, membershipPlanId: null }

      const { data: membershipBenefitsResult } = await axios.post(NEXT_MEMBERSHIP_BENEFITS, data)
      if (membershipBenefitsResult?.result) {
        const membershipPlans = membershipBenefitsResult?.result
        setMembership(membershipPlans)
      }
    }
    fetchMembership()
  }, [basket, basket?.id, basket?.lineItems])

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

  const recordEventInEngage = () => {
    const iterator = cart?.lineItems?.values();
    const itemsFromArr = []
    for (const value of iterator) {
      itemsFromArr?.push({
        id: parseItemId(value?.stockCode) || EmptyString,
        name: value?.name || EmptyString,
        quantity: value?.qty || 1,
        price: value?.totalPrice?.raw?.withTax || 1,
        line_price: value?.totalPrice?.raw?.withTax * value?.qty,
        sku: value?.sku || EmptyString
      })
    }

    const cardData = {
      item_id: "cart",
      item_ids: cart?.lineItems?.map((x: any) => parseItemId(x?.stockCode)) || [],
      items: itemsFromArr,
      total_value: cart?.grandTotal?.raw?.withTax || EmptyString
    }

    if (typeof window !== "undefined" && window?.ch_session) {
      window.ch_checkout_initiate_before(cardData)
    }
  }

  useEffect(() => {
    async function loadShippingPlans() {
      await fetchShippingPlans([])
    }

    if (cart?.shippingMethods.length > 0) {
      loadShippingPlans()
    } else {
      setCartItems(cart)
    }
    // calling Engage event
    recordEventInEngage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    if (isOpen && !(type === 'delete')) {
      closeModal()
    }
    const asyncHandleItem = async () => {
      let data: any = {
        basketId,
        productId: product?.id,
        stockCode: product?.stockCode,
        manualUnitPrice: product?.manualUnitPrice,
        displayOrder: product?.displayOrderta,
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
        setCartItems(item)
        setBasket(item)
        if (isSplitDelivery) {
          fetchShippingPlans(item)
        }
      } catch (error) {
        console.log(error)
      }
      if (isOpen && type === 'delete') {
        setLoadingAction(LoadingActionType.NONE)
        closeModal()
      }
    }
    asyncHandleItem()
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
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
  const renderStatusSoldOut = (soldOutMessage: any) => {
    return (
      <div className="">
        {reValidateData?.message != null && soldOutMessage != '' && (matchStrings(soldOutMessage, "sold out", true) ? (
          <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <div className="flex text-xs font-semibold text-left text-red-500">
              <span className="relative mr-1">
                <img alt="Sold Out" src="/assets/images/not-shipped-edd.svg" width={20} height={20} className="relative inline-block mr-1 top-2" />
              </span>
              <span className="mt-2">{soldOutMessage}</span>
            </div>
          </div>
        ) : matchStrings(soldOutMessage, "price changed", true) && (
          <div className="items-center w-full col-span-12">
            <div className="flex justify-center w-full p-1 text-xs font-semibold text-center text-gray-500 bg-gray-100 border border-gray-100 rounded">
              {soldOutMessage}
            </div>
          </div>
        )
        )}
      </div>
    );
  };

  const renderStatusInStock = (product: any) => {
    return (
      product?.currentStock > 0 &&
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">{translate('label.product.inStockText')}</span>
      </div>
    );
  };

  const isMembershipItemOnly = useMemo(() => {
    const membershipItemsCount = basket?.lineItems?.filter((x: any) => x?.isMembership || false)?.length || 0
    return (membershipItemsCount === basket?.lineItems?.length)
  }, [basket])

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.basket.basketText')}</title>
        <meta name="title" content={translate('label.basket.basketText')} />
        <meta name="description" content={translate('label.basket.basketText')} />
        <meta name="keywords" content={translate('label.basket.basketText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.basket.basketText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.basket.basketText')} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      <div className={`container w-full py-4 pt-10  lg:pb-28 lg:pt-20 ${CURRENT_THEME == 'green' ? 'bg-[#EEEEEE]' : 'bg-white'}`}>
        <h1 className="block mb-4 text-2xl font-semibold sm:text-3xl lg:text-4xl sm:mb-16 basket-h1">
          <span>{translate('label.basket.shoppingCartText')}{' '}</span>
          <span className="pl-2 text-sm font-normal tracking-normal text-gray-400 top-2">
            {userCart?.lineItems?.length}{' '}
            {userCart?.lineItems?.length > 1 ? translate('common.label.itemPluralText') : translate('common.label.itemSingularText')} {translate('label.basket.addedText')}
          </span>
        </h1>
        <hr className={`${CURRENT_THEME != 'green' ? 'my-2 xl:my-12 border-slate-200 dark:border-slate-700' : 'my-0 xl:my-0'} border-[#EEEEEE] dark:border-slate-700`} />
        {!isEmpty && !isSplitDelivery && (
          <>
            <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16 basket-panel">
              <CartItems userCart={userCart} reValidateData={reValidateData} handleItem={handleItem} openModal={openModal} setItemClicked={setItemClicked} />
              <section aria-labelledby="summary-heading" className={` ${CURRENT_THEME == 'green' ? 'bg-white rounded' : 'bg-slate-50 rounded-2xl'} p-4 mt-10 border sm:p-6  border-slate-100 md:sticky top-24 lg:col-span-5 sm:mt-0`} >
                <h4 id="summary-heading" className="block mb-4 text-xl font-semibold sm:text-2xl lg:text-2xl sm:mb-6" >
                  {translate('label.orderSummary.basketSummaryText')}
                </h4>
                {!isMembershipItemOnly && featureToggle?.features?.enableMembership && (
                  <>
                    <MembershipOfferCard basket={basket} setOpenOMM={setOpenOMM} defaultDisplayMembership={defaultDisplayMembership} membership={membership} setBasket={setBasket} />
                    <OptMembershipModal open={openOMM} basket={basket} setOpenOMM={setOpenOMM} allMembershipPlans={allMembershipPlans} defaultDisplayMembership={defaultDisplayMembership} setBasket={setBasket} />
                  </>
                )}
                <div className="mt-2 sm:mt-6">
                  <PromotionInput basketPromos={basketPromos} items={cartItems} getBasketPromoses={getBasketPromos} membership={membership} setBasket={setBasket} />
                </div>
                <dl className={`text-sm mt-7 text-slate-500 dark:text-slate-400  ${CURRENT_THEME != 'green' ? 'divide-y divide-slate-200/70 dark:divide-slate-700/80' : ''}`}>
                  <div className="flex items-center justify-between py-4 basket-summary-price">
                    <dt className="text-sm text-gray-600">
                      {isIncludeVAT ? translate('label.orderSummary.subTotalVATIncText') : translate('label.orderSummary.subTotalVATExText')}
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT ? cartItems?.subTotal?.formatted?.withTax : cartItems?.subTotal?.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4 basket-summary-price">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{translate('label.orderSummary.shippingText')}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT ? cartItems?.shippingCharge?.formatted?.withTax : cartItems?.shippingCharge?.formatted?.withoutTax}
                    </dd>
                  </div>
                  {userCart.promotionsApplied?.length > 0 && (
                    <div className="flex items-center justify-between py-4 basket-summary-price">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{translate('label.orderSummary.discountText')}</span>
                      </dt>
                      <dd className="font-semibold text-red-500 text-md">
                        <p> {'-'} {isIncludeVAT ? cartItems?.discount?.formatted?.withTax : cartItems?.discount?.formatted?.withoutTax} </p>
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-4 basket-summary-price">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{translate('label.orderSummary.taxText')}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {cartItems?.grandTotal?.formatted?.tax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-gray-900 border-t basket-summary-price-total">
                    <dt className="text-lg font-semibold text-black">
                      {translate('label.orderSummary.totalText')}
                    </dt>
                    <dd className="text-xl font-semibold text-black"> {isIncludeVAT ? cartItems?.grandTotal?.formatted?.withTax : cartItems?.grandTotal?.formatted?.withTax} </dd>
                  </div>
                </dl>

                <div className="mt-1 mb-6 sm:mb-0">
                  <Link href="/checkout">
                    <button type="submit" className={`nc-Button relative h-auto inline-flex items-center justify-center transition-colors text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl mt-8 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ${CURRENT_THEME != 'green' ? 'rounded-full' : 'rounded-lg'}`} >
                      {translate('label.orderSummary.placeOrderBtnText')}
                    </button>
                  </Link>
                </div>
              </section>
            </div>
            <div>
              {altRelatedProducts?.relatedProducts && (
                <div className="flex flex-col px-4 pb-10 mt-0 sm:px-8 sm:pb-16 cart-related-prod ">
                  <RelatedProductWithGroup products={altRelatedProducts?.relatedProducts?.products?.results || []} productPerColumn={1.7} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
                </div>
              )}
            </div>
          </>
        )}
        {!isEmpty && isSplitDelivery && splitBasketProducts && (
          <>
            <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16 basket-panel">
              <section aria-labelledby="cart-heading" className={`lg:col-span-7 basket-cart-items`}>
                <div className='w-full divide-y divide-slate-200 dark:divide-slate-700'>
                  {Object.keys(splitBasketProducts)?.map(
                    (deliveryDate: any, Idx: any) => (
                      <>
                        {Object.keys(splitBasketProducts)[0] === 'Invalid Date' ? (
                          <LoadingDots />
                        ) : (
                          <h2 className="text-sm font-bold">
                            {translate('label.checkout.deliveryText')`${Idx + 1}`}
                          </h2>
                        )}
                        {splitBasketProducts[deliveryDate]?.map(
                          (product: any, productIdx: number) => (
                            <div key={productIdx} className="relative flex py-2 sm:py-2 xl:py-2 first:pt-0 last:pb-0" >
                              <div className="flex-shrink-0">
                                <img style={css} width={140} height={180} src={generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={product.name || 'cart-item'} className="object-cover object-center w-16 rounded-lg sm:w-28 image" />
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
                                  {product?.price?.raw?.withTax > 0 ? (isIncludeVAT ? product.price?.formatted?.withTax : product.price?.formatted?.withoutTax) : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'>{translate('label.orderSummary.freeText')}</span>}
                                  {product?.price?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax != product.price?.raw?.withTax && (
                                    <span className="px-2 text-sm text-red-400 line-through">
                                      {translate('label.basket.priceLabelText')}{' '}
                                      {isIncludeVAT ? product?.listPrice.formatted?.withTax : product?.listPrice.formatted?.withoutTax}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                                  {product?.variantProducts?.length > 0 ? (
                                    <div role="button" onClick={handleToggleOpenSizeChangeModal.bind(null, product)} >
                                      <div className="border w-[fit-content] flex items-center mt-3 py-2 px-2">
                                        <div className="mr-1 text-sm text-gray-700">
                                          {translate('common.label.sizeText')}{' '}
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
                                    {!product?.isMembership && <MinusIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer" />}
                                    <span className="w-10 h-8 px-4 py-2 text-md sm:py-2">
                                      {product.qty}
                                    </span>
                                    {!product?.isMembership && <PlusIcon className="w-4 cursor-pointer" onClick={() => handleItem(product, 'increase')} />}
                                  </div>
                                </div>

                                {product.children?.map(
                                  (child: any, idx: number) => (
                                    <div className="flex mt-10" key={'child' + idx} >
                                      <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-md">
                                        <img src={child.image} alt={child.name || 'cart-image'} className="object-cover object-center w-full h-full" />
                                      </div>
                                      <div className="flex justify-between ml-5 font-medium text-gray-900">
                                        <Link href={`/${child.slug}`}> {child.name} </Link>
                                        <p className="ml-4">
                                          {child.price?.formatted?.withTax > 0 ? isIncludeVAT ? child.price?.formatted?.withTax : child.price?.formatted?.withoutTax : ''}
                                        </p>
                                      </div>
                                      {!child.parentProductId ? (
                                        <div className="flex items-center justify-end flex-1 text-sm">
                                          <button type="button" onClick={() => handleItem(child, 'delete')} className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500" >
                                            <span className="sr-only"> {translate('common.label.removeText')} </span>
                                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
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
                                  <button type="button" onClick={() => handleItem(product, 'delete')} className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500" >
                                    <span className="sr-only">
                                      {translate('common.label.removeText')}
                                    </span>
                                    <TrashIcon className="w-4 h-4 mt-2 text-red-500 sm:h-5 sm:w-5" aria-hidden="true" />
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
                </div>
              </section>
              <section aria-labelledby="summary-heading" className={` ${CURRENT_THEME == 'green' ? 'bg-white rounded' : 'bg-slate-50 rounded-2xl'} p-4 mt-10 border sm:p-6  border-slate-100 md:sticky top-24 lg:col-span-5 sm:mt-0`} >
                <h4 id="summary-heading" className="mb-1 font-semibold text-black uppercase font-3xl" >
                  {translate('label.orderSummary.orderSummaryText')}
                </h4>
                <div className="mt-2 sm:mt-6">
                  <PromotionInput basketPromos={basketPromos} items={cartItems} getBasketPromoses={getBasketPromos} membership={membership} setBasket={setBasket} />
                </div>
                <dl className="mt-6 space-y-2 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">
                      {isIncludeVAT ? translate('label.orderSummary.subTotalVATIncText') : translate('label.orderSummary.subTotalVATExText')}
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT ? cartItems.subTotal?.formatted?.withTax : cartItems.subTotal?.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{translate('label.orderSummary.shippingText')}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {isIncludeVAT ? cartItems.shippingCharge?.formatted?.withTax : cartItems.shippingCharge?.formatted?.withoutTax}
                    </dd>
                  </div>
                  {userCart.promotionsApplied?.length > 0 && (
                    <div className="flex items-center justify-between pt-2 sm:pt-2">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{translate('label.orderSummary.discountText')}</span>
                      </dt>
                      <dd className="font-semibold text-red-500 text-md">
                        <p>
                          {'-'} {isIncludeVAT ? cartItems.discount?.formatted?.withTax : cartItems.discount?.formatted?.withoutTax}
                        </p>
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 sm:pt-1">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{translate('label.orderSummary.taxText')}</span>
                    </dt>
                    <dd className="font-semibold text-black text-md">
                      {cartItems.grandTotal?.formatted?.tax}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-gray-900 border-t">
                    <dt className="text-lg font-bold text-black">
                      {translate('label.orderSummary.totalText')}
                    </dt>
                    <dd className="text-xl font-semibold text-black">
                      {isIncludeVAT ? cartItems.grandTotal?.formatted?.withTax : cartItems.grandTotal?.formatted?.withTax}
                    </dd>
                  </div>
                </dl>

                <div className="mt-1 mb-6 sm:mb-0">
                  <Link href="/checkout">
                    <button type="submit" className={`nc-Button relative h-auto inline-flex items-center justify-center transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl mt-8 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ${CURRENT_THEME != 'green' ? 'rounded-full' : 'rounded-lg'}`} >
                      {translate('label.orderSummary.placeOrderBtnText')}
                    </button>
                  </Link>
                </div>
              </section>
            </div>
            <div>
              {altRelatedProducts?.relatedProducts && (
                <div className="flex flex-col px-4 pb-10 mt-0 sm:px-8 sm:pb-16 cart-related-prod ">
                  <RelatedProductWithGroup products={altRelatedProducts?.relatedProducts?.products?.results || []} productPerColumn={1.7} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
                </div>
              )}
            </div>
          </>
        )}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center w-full h-full py-10 text-gray-900">
            {translate('label.basket.youDontHaveAnyItems')}
            <Link href="/search">
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" >
                {translate('label.basket.catalogText')}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        )}
        <SizeChangeModal open={openSizeChangeModal} handleToggleOpen={handleToggleOpenSizeChangeModal} product={selectedProductOnSizeChange} />
      </div>
      <CartItemRemoveModal product={itemClicked} isOpen={isOpen} closeModal={closeModal} loadingAction={loadingAction} handleItem={handleItem} itemClicked={itemClicked} setLoadingAction={setLoadingAction} config={config} />
    </>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
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

  const cachedDataUID = {
    allMembershipsUID: Redis.Key.ALL_MEMBERSHIPS,
  }
  const cachedData = await getDataByUID([
    cachedDataUID.allMembershipsUID,
  ])
  let allMembershipsUIDData: any = parseDataValue(cachedData, cachedDataUID.allMembershipsUID)
  if (!allMembershipsUIDData) {
    const data = {
      "SearchText": null,
      "PricingType": 0,
      "Name": null,
      "TermType": 0,
      "IsActive": 1,
      "ProductId": Guid.empty,
      "CategoryId": Guid.empty,
      "ManufacturerId": Guid.empty,
      "SubManufacturerId": Guid.empty,
      "PlanType": 0,
      "CurrentPage": 0,
      "PageSize": 0
    }
    const membershipPlansPromise = commerce.getMembershipPlans({ data, cookies: context?.req?.cookies })
    allMembershipsUIDData = await membershipPlansPromise
    await setData([{ key: cachedDataUID.allMembershipsUID, value: allMembershipsUIDData }])
  }

  let defaultDisplayMembership = EmptyObject
  if (allMembershipsUIDData?.result?.length) {
    const membershipPlan = allMembershipsUIDData?.result?.sort((a: any, b: any) => a?.price?.raw?.withTax - b?.price?.raw?.withTax)[0]
    if (membershipPlan) {
      const promoCode = membershipPlan?.membershipBenefits?.[0]?.code
      if (promoCode) {
        const promotion = await commerce.getPromotion(promoCode)
        defaultDisplayMembership = { membershipPromoDiscountPerc: stringToNumber(promotion?.result?.additionalInfo1), membershipPrice: membershipPlan?.price?.raw?.withTax }
      }
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      cart: response,
      snippets: response?.snippets || [],
      allMembershipPlans: allMembershipsUIDData?.result,
      defaultDisplayMembership,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
