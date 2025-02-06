// Base Imports
import { Fragment, useEffect, useMemo, useState } from 'react'

// Package Imports
import NextHead from 'next/head'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import MembershipOfferCard from '@components/membership/MembershipOfferCard'
import OptMembershipModal from '@components/membership/OptMembershipModal'

// Component Imports
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import { basketId as basketIdGenerator } from '@components/ui/context'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmallIcon, MinusSmallIcon, ChevronDownIcon, TrashIcon, MinusIcon, PlusIcon, NoSymbolIcon, CheckIcon, HeartIcon } from '@heroicons/react/24/outline'
import { LoadingDots } from '@components/ui'
import { generateUri } from '@commerce/utils/uri-util'
import { matchStrings, parseItemId, tryParseJson } from '@framework/utils/parse-util'
import SizeChangeModal from '@components/SectionCheckoutJourney/cart/SizeChange'
import { getCartValidateMessages, getCurrentPage, vatIncluded, } from '@framework/utils/app-util'
import { EmptyString, EmptyGuid, LoadingActionType, NEXT_BASKET_VALIDATE, NEXT_GET_ALT_RELATED_PRODUCTS, NEXT_GET_BASKET_PROMOS, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_SHIPPING_PLANS, SITE_NAME, SITE_ORIGIN_URL, collectionSlug, NEXT_MEMBERSHIP_BENEFITS, CURRENT_THEME, NEXT_CREATE_WISHLIST, BASKET_PROMO_TYPES } from '@components/utils/constants'
import RelatedProductWithGroup from '@components/Product/RelatedProducts/RelatedProductWithGroup'
import { Guid } from '@commerce/types'
import { stringToBoolean } from '@framework/utils/parse-util'
import CartItemRemoveModal from '@components/CartItemRemoveModal'
import { useTranslation } from '@commerce/utils/use-translation'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import PromotionInput from '@components/SectionCheckoutJourney/cart/PromotionInput'
import CartItems from '@components/SectionCheckoutJourney/checkout/CartItem'
import wishlistHandler from '@components/services/wishlist'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { AnalyticsEventType } from '@components/services/analytics'
import { round, sortBy } from 'lodash'
import { groupCartItemsById } from '@components/utils/cart'
import CartSideBarProductCard from '@components/CartSideBarProductCard'
import BasketGroupProduct from '@components/cart/BasketGroupProduct'

function Cart({ cart, deviceInfo, maxBasketItemsCount, config, allMembershipPlans, defaultDisplayMembership, featureToggle }: any) {
  const router = useRouter()
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

  const { setCartItems, cartItems, resetKitCart, basketId, isGuestUser, user, setIsSplitDelivery, isSplitDelivery, openLoginSideBar, addToWishlist, openWishlist, setSidebarView, closeSidebar, setOverlayLoaderState } = useUI()
  const { addToCart, getCart } = cartHandler()
  const translate = useTranslation()
  const [isGetBasketPromoRunning, setIsGetBasketPromoRunning] = useState(false)
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  const [altRelatedProducts, setAltRelatedProducts] = useState<any>()
  const [relatedProducts, setRelatedProducts] = useState<any>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [splitDeliveryItems, setSplitDeliveryItems] = useState<any>(null)
  const [splitDeliveryDates, setSplitDeliveryDates] = useState<any>(null)
  const [isWishlistClicked, setIsWishlistClicked] = useState(false)
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
  const { isInWishList } = wishlistHandler()
  const getUserId = () => {
    return user?.userId && user?.userId != Guid.empty ? user?.userId : cartItems?.userId
  }
  const enableHtmlScroll = () => {
    const element: any = document.getElementsByTagName('html')[0]
    element.classList.add('overlow-y-auto-p')
  }
  const insertToLocalWishlist = (product: any) => {
    const userId = getUserId()
    if (isGuestUser || (userId && matchStrings(userId, Guid.empty, true))) {
      openLoginSideBar()
      return
    }
    const createWishlist = async () => {
      try {
        await axios.post(NEXT_CREATE_WISHLIST, {
          id: user?.userId,
          productId: (product?.productId).toLowerCase(),
          flag: true,
        })

      } catch (error) {
        console.log(error, 'error')
      }
    }
    createWishlist()
    setIsWishlistClicked(true)
    addToWishlist(product)
    handleItem(product, 'delete')
    openWishlistAfter()
  }
  const openWishlistAfter = () => {
    setTimeout(() => openWishlist(), 1000)
  }

  const handleWishList = async (product: any | Array<any>) => {
    closeModal()
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      //  setAlert({ type: 'success', msg:" Please Login "})
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async (product: any) => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: getUserId(),
            productId: itemClicked?.length
              ? product?.productId.toLowerCase()
              : itemClicked?.productId.toLowerCase(),
            flag: true,
          })
          insertToLocalWishlist(product)
        } catch (error) {
          console.log(error, 'error')
        }
      }

      if (itemClicked && itemClicked?.length) {
        itemClicked?.forEach((product: any) => {
          createWishlist(product)
        })
      } else if (itemClicked?.productId) {
        createWishlist(product)
      }
    } else {
      closeSidebar()
      setSidebarView('LOGIN_VIEW')
      enableHtmlScroll()
    }

    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }
  }
  const getBasketPromos = async (basketId: string) => {
    const { data: basketPromos } = await axios.get(NEXT_GET_BASKET_PROMOS, {
      params: { basketId: basketId },
    })
    if (basketPromos?.applicablePromotions?.length) {
      basketPromos.applicablePromotions = basketPromos?.applicablePromotions?.filter((o: any) => o?.promoType !== BASKET_PROMO_TYPES.KIT)
    }
    if (basketPromos?.availablePromotions?.length) {
      basketPromos.availablePromotions = basketPromos?.availablePromotions?.filter((o: any) => o?.promoType !== BASKET_PROMO_TYPES.KIT)
    }
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

  let currentPage = getCurrentPage()
  const extras = { originalLocation: SITE_ORIGIN_URL + router?.asPath }
  useAnalytics(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemListName: 'Cart', itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Basket, })

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
    const shippingMethodItem: any = cart?.shippingMethods.find(
      (method: any) => method.id === cart?.shippingMethodId
    )

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
    if (featureToggle?.features?.enableMembership) {
      fetchMembership()
    }
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

    if (cart?.shippingMethods?.length > 0) {
      loadShippingPlans()
    } else {
      setCartItems(cart)
    }
    // calling Engage event
    recordEventInEngage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItem = (
    product: any,
    type = 'increase',
    selectQuantity: number = 1
  ) => {
    const asyncHandleItem = async (product: any) => {
      let data: any = {
        basketId,
        productId: product?.id,
        name: product?.name,
        stockCode: product?.stockCode,
        manualUnitPrice: product?.price?.raw?.withoutTax,
        displayOrder: product?.displayOrderta,
        qty: -1,
      }
      // add prop 'basketItemGroupData' for removing Kit items
      if (product?.basketItemGroupData) {
        data.basketItemGroupData = product?.basketItemGroupData
      }
      // add prop 'basketItemGroupId' for removing Kit items
      if (product?.basketItemGroupId) {
        data.basketItemGroupId = product?.basketItemGroupId
      }
      if (type === 'increase') {
        data.qty = 1
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o?.productId, product?.recordId, true) || matchStrings(o?.productId, product?.productId, true)) {
            return o
          }
        })
        const attributeData: any = tryParseJson(product?.attributesJson || {})

      }
      if (type === 'delete') {
        data.qty = 0
      }
      if (type === 'select') {
        if (product?.qty !== selectQuantity) {
          //increase or decrease quantity by finding difference between values
          data.qty = selectQuantity - product?.qty
        }
      }
      try {
        const item = await addToCart(data, type, { product })
        setLoadingAction(LoadingActionType.NONE)
        closeModal()
        getBasketPromos(basketId)
        if (isSplitDelivery) {
          setCartItems(item)
          fetchShippingPlans(item)
        } else {
          setCartItems(item)
        }
      } catch (error) {
        //console.log(error)
      }
    }
    if (product && product?.length) {
      product?.forEach((product: any) => {
        asyncHandleItem(product)
        setBasketReValidate([])
      })
      resetKitCart()
    } else if (product?.productId) {
      asyncHandleItem(product)
    }
    setOverlayLoaderState({
      visible: false,
      message: "",
    })
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const itemsInBag = () => {
    return cartItems?.lineItems
      ?.map((item: any) => item.qty)
      .reduce((sum: number, current: number) => sum + current, 0)
  }
  const handleClose = () => {
    setTimeout(() => closeSidebar(), 500)
    // setCartSidebarOpen(false)
  }
  const isIncludeVAT = vatIncluded()
  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0
  const css = { maxWidth: '100%', height: 'auto' }

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const [userCartItems, setUserCartItems] = useState<any>(null)
  function handleRedirectToPDP() { }
  useEffect(() => {
    let items = sortBy(cartItems?.lineItems, 'displayOrder')
    items = Object.values(groupCartItemsById(cartItems?.lineItems))
    setUserCartItems(items)
  }, [cartItems?.lineItems])
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
      <div className={`container w-full py-4 pt-4 lg:pb-10 lg:pt-10 ${CURRENT_THEME == 'green' ? 'bg-[#EEEEEE]' : 'bg-white'}`}>
        <h1 className="block mb-2 text-2xl font-semibold sm:text-3xl lg:text-4xl sm:mb-0 basket-h1 dark:text-black">
          <span>{translate('label.basket.shoppingCartText')}{' '}</span>
          <span className="pl-2 text-sm font-normal tracking-normal text-gray-400 top-2">
            {userCart?.lineItems?.length}{' '}
            {userCart?.lineItems?.length > 1 ? translate('common.label.itemPluralText') : translate('common.label.itemSingularText')} {translate('label.basket.addedText')}
          </span>
        </h1>
        <hr className={`${CURRENT_THEME != 'green' ? 'my-2 xl:my-4 border-slate-200 dark:border-slate-700' : 'my-0 xl:my-0'} border-[#EEEEEE] dark:border-slate-700`} />
        {!isEmpty && !isSplitDelivery && (
          <>
            <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16 basket-panel">
              <section aria-labelledby="cart-heading" className={`lg:col-span-7 basket-cart-items`}>
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
                    <Fragment key={productIdx}>
                      <CartSideBarProductCard
                        product={product}
                        productNameWithVoltageAttr={productNameWithVoltageAttr}
                        css={css}
                        itemsInBag={itemsInBag}
                        handleRedirectToPDP={handleRedirectToPDP}
                        handleClose={handleClose}
                        handleToggleOpenSizeChangeModal={handleToggleOpenSizeChangeModal}
                        maxBasketItemsCount={maxBasketItemsCount}
                        isIncludeVAT={isIncludeVAT}
                        discount={discount}
                        handleItem={handleItem}
                        openModal={openModal}
                        setItemClicked={setItemClicked}
                        reValidateData={reValidateData}
                        soldOutMessage={soldOutMessage}
                        getLineItemSizeWithoutSlug={getLineItemSizeWithoutSlug}
                      />
                      {product.children?.map(
                        (child: any, idx: number) => (
                          <CartSideBarProductCard
                            product={child}
                            css={css}
                            handleRedirectToPDP={handleRedirectToPDP}
                            handleClose={handleClose}
                            handleToggleOpenSizeChangeModal={handleToggleOpenSizeChangeModal}
                            isIncludeVAT={isIncludeVAT}
                            discount={discount}
                            handleItem={handleItem}
                            openModal={openModal}
                            setItemClicked={setItemClicked}
                            reValidateData={reValidateData}
                            soldOutMessage={soldOutMessage}
                            getLineItemSizeWithoutSlug={getLineItemSizeWithoutSlug}
                            key={idx}
                          />
                        )
                      )}
                    </Fragment>
                  )
                }
                )}
              </section>
              {/* <CartItems userCart={userCart} reValidateData={reValidateData} handleItem={handleItem} openModal={openModal} itemClicked={itemClicked} setItemClicked={setItemClicked} /> */}
              <section aria-labelledby="summary-heading" className={` ${CURRENT_THEME == 'green' ? 'bg-white rounded-md shadow-md top-2' : 'bg-slate-50 rounded-2xl top-24'} p-4 mt-10 border sm:p-6  border-slate-100 md:sticky lg:col-span-5 sm:mt-0`} >
                <h4 id="summary-heading" className="block mb-4 text-xl font-semibold sm:text-2xl lg:text-2xl sm:mb-6 dark:text-black">
                  {translate('label.orderSummary.basketSummaryText')}
                </h4>
                {!isMembershipItemOnly && featureToggle?.features?.enableMembership && (
                  <>
                    <MembershipOfferCard basket={basket} setOpenOMM={setOpenOMM} defaultDisplayMembership={defaultDisplayMembership} membership={membership} setBasket={setBasket} />
                    <OptMembershipModal open={openOMM} basket={basket} setOpenOMM={setOpenOMM} allMembershipPlans={allMembershipPlans} defaultDisplayMembership={defaultDisplayMembership} refreshBasket={refreshBasket} setBasket={setBasket} />
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
                  {userCart?.promotionsApplied?.length > 0 && (
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
                  {cartItems?.grandTotal?.raw?.withTax > 0 &&
                    <div className="flex items-center justify-between pt-2 text-gray-900 border-t basket-summary-price-total">
                      <dt className="text-lg font-semibold text-black">
                        {translate('label.orderSummary.totalText')}
                      </dt>
                      <dd className="text-xl font-semibold text-black"> {cartItems?.grandTotal?.formatted?.withTax} </dd>
                    </div>
                  }
                </dl>

                <div className="mt-1 mb-6 sm:mb-0">
                  <Link href="/checkout">
                    <button type="submit" className={`nc-Button relative h-auto inline-flex items-center justify-center transition-colors text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 text-slate-50 dark:text-slate-50 shadow-xl mt-8 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ${CURRENT_THEME != 'green' ? 'rounded-full' : 'rounded-lg'}`} >
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

                          return (
                            <>
                              <CartSideBarProductCard
                                key={product?.productId}
                                product={product}
                                productNameWithVoltageAttr={productNameWithVoltageAttr}
                                css={css}
                                itemsInBag={itemsInBag}
                                handleRedirectToPDP={handleRedirectToPDP}
                                handleClose={handleClose}
                                handleToggleOpenSizeChangeModal={handleToggleOpenSizeChangeModal}
                                maxBasketItemsCount={maxBasketItemsCount}
                                isIncludeVAT={isIncludeVAT}
                                discount={discount}
                                handleItem={handleItem}
                                openModal={openModal}
                                setItemClicked={setItemClicked}
                                reValidateData={reValidateData}
                                soldOutMessage={soldOutMessage}
                                getLineItemSizeWithoutSlug={getLineItemSizeWithoutSlug}
                              />
                              {product.children?.map((child: any, idx: number) => (
                                <CartSideBarProductCard
                                  product={child}
                                  css={css}
                                  handleRedirectToPDP={handleRedirectToPDP}
                                  handleClose={handleClose}
                                  handleToggleOpenSizeChangeModal={handleToggleOpenSizeChangeModal}
                                  isIncludeVAT={isIncludeVAT}
                                  discount={discount}
                                  handleItem={handleItem}
                                  openModal={openModal}
                                  setItemClicked={setItemClicked}
                                  reValidateData={reValidateData}
                                  soldOutMessage={soldOutMessage}
                                  getLineItemSizeWithoutSlug={getLineItemSizeWithoutSlug}
                                  key={idx}
                                />
                              ))}
                            </>
                          )
                        })}
                      </div>
                    ))}
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
                  {userCart?.promotionsApplied?.length > 0 && (
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
                  {cartItems?.grandTotal?.raw?.withTax > 0 &&
                    <div className="flex items-center justify-between pt-2 sm:pt-1">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{translate('label.orderSummary.taxText')}</span>
                      </dt>
                      <dd className="font-semibold text-black text-md">
                        {cartItems.grandTotal?.formatted?.tax}
                      </dd>
                    </div>
                  }
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
                    <button type="submit" className={`nc-Button relative h-auto inline-flex items-center justify-center transition-colors text-sm sm:text-white font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl mt-8 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ${CURRENT_THEME != 'green' ? 'rounded-full' : 'rounded-lg'}`} >
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
      <CartItemRemoveModal isOpen={isOpen} closeModal={closeModal} loadingAction={loadingAction} handleItem={handleItem} itemClicked={itemClicked} setLoadingAction={setLoadingAction} config={config} />
    </>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Cart

export const getServerSideProps: GetServerSideProps = async (context: any) => {
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
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.CART })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
      cart: response,
      snippets: response?.snippets || [],
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
