import Link from 'next/link'
import axios from 'axios'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, useState, Fragment } from 'react'
import { matchStrings, priceFormat, stringFormat, tryParseJson, } from '@framework/utils/parse-util'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusSmallIcon, MinusSmallIcon, ChevronDownIcon, EyeIcon, CheckCircleIcon, TrashIcon, HeartIcon, ArrowRightIcon, } from '@heroicons/react/24/outline'
import PromotionInput from '../PromotionInput'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { Messages, NEXT_CREATE_WISHLIST, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_GET_ALT_RELATED_PRODUCTS, collectionSlug, PRODUCTS_SLUG_PREFIX, NEXT_GET_PRODUCT, NEXT_GET_BASKET_PROMOS, NEXT_BASKET_VALIDATE, LoadingActionType, } from '@components/utils/constants'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { getCurrentPage, vatIncluded, getCartValidateMessages, } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import RelatedProductWithGroup from '@components/Product/RelatedProducts/RelatedProductWithGroup'
import SizeChangeModal from '../SizeChange'
import { IExtraProps } from '@components/Layout/Layout'
import { Guid } from '@commerce/types'
import RecentlyViewedProduct from '@components/Product/RelatedProducts/RecentlyViewedProducts'
import wishlistHandler from '@components/services/wishlist'
import { useTranslation } from '@commerce/utils/use-translation'
import RelatedProducts from '@components/Product/RelatedProducts'
import CartItemRemoveModal from '@components/CartItemRemoveModal'
import Engraving from '@components/Product/Engraving'

const CartSidebarView: FC<React.PropsWithChildren<IExtraProps>> = ({ deviceInfo, maxBasketItemsCount, config, }: any) => {
  const { addToWishlist, openWishlist, setAlert, setSidebarView, closeSidebar, setCartItems, cartItems, basketId, openLoginSideBar, user, isGuestUser, displaySidebar, } = useUI()
  const { isInWishList } = wishlistHandler()
  const { isMobile, isOnlyMobile, isIPadorTablet } = deviceInfo
  const [isEngravingOpen, setIsEngravingOpen] = useState(false)
  const [selectedEngravingProduct, setSelectedEngravingProduct] = useState(null)
  const { getCart, addToCart } = useCart()
  const { BasketViewed } = EVENTS_MAP.EVENT_TYPES
  const { Basket } = EVENTS_MAP.ENTITY_TYPES
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [lastCartItemProductId, setLastCartItemProductId] = useState('')
  const [relatedProducts, setRelatedProducts] = useState<any>()
  const [reValidateData, setBasketReValidate] = useState<any>([])
  const [variantProducts, setVariantProducts] = useState<Array<any> | undefined>(undefined)
  const [productSizes, setProductSizes] = useState<Array<any> | undefined>(undefined)
  const [basketPromos, setBasketPromos] = useState<Array<any> | undefined>(undefined)
  const [isGetBasketPromoRunning, setIsGetBasketPromoRunning] = useState(false)
  const [paymentOffers, setPaymentOffers] = useState<any | undefined>(undefined)
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(undefined)
  const [isBasketFetched, setIsBasketFetched] = useState(false)
  const [removedProduct, setRemovedProduct] = useState<any | Array<any>>()
  const [isOpen, setIsOpen] = useState(false)
  const [itemClicked, setItemClicked] = useState<any | Array<any>>()
  const [altRelatedProducts, setAltRelatedProducts] = useState<any>()
  const [sizeDialogState, setSizeDialogState] = useState<any>({ type: '', })
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false)
  const [isWishlistClicked, setIsWishlistClicked] = useState(false)
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [selectedProductOnSizeChange, setSelectedProductOnSizeChange] = useState(null)
  const isIncludeVAT = vatIncluded()
  const translate = useTranslation()
  const handleToggleOpenSizeChangeModal = async (product?: any) => {
    setOpenSizeChangeModal(!openSizeChangeModal)
    if (product) {
      setSelectedProductOnSizeChange(product)
    } else {
      setSelectedProductOnSizeChange(null)
    }
  }
  useEffect(() => {
    setTimeout(() => setCartSidebarOpen(displaySidebar), 250)
  }, [displaySidebar])

  let firstProductId = ''
  if (cartItems?.lineItems?.length > 0) {
    firstProductId = cartItems?.lineItems?.length ? cartItems?.lineItems?.filter((x: any, idx: number) => idx == 0)[0]?.productId : ''
  }
  let currentPage = getCurrentPage()
  const getUserId = () => {
    return user?.userId && user?.userId != Guid.empty ? user?.userId : cartItems?.userId
  }
  //getUserId todo

  const getBasketPromos = async (basketId: string) => {
    const { data: basketPromos } = await axios.get(NEXT_GET_BASKET_PROMOS, {
      params: { basketId: basketId },
    })
    setBasketPromos(basketPromos)
    return basketPromos
  }

  const getJusPayPromos = async (cartItems: any) => {
    const data = {
      order: {
        amount: cartItems?.grandTotal?.raw?.withTax?.toString(),
        currency: cartItems?.baseCurrency,
      },
    }
    const { data: offersResult } = { data: '' } //await getJusPayOffers(data);
    //console.log(offersResult);
    setPaymentOffers(offersResult)
  }

  const showRemove = (_product: Array<any> | any) => {
    setRemovedProduct(_product)
  }

  const fetchBasketReValidate = async () => {
    const { data: reValidate }: any = await axios.post(NEXT_BASKET_VALIDATE, {
      basketId: basketId,
    })
    setBasketReValidate({ ...reValidate?.result, message: reValidate?.result?.messageCode })
    return reValidate?.result
  }

  useEffect(() => {
    const handleAsync = async () => {
      const promise = await new Promise<any>(
        async (resolve: any, reject: any) => {
          await getBasketPromos(basketId)
          await fetchBasketReValidate()
          setIsGetBasketPromoRunning(!isGetBasketPromoRunning)
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

  const handleCartItems = async () => {
    const items = await getCart({ basketId })
    setCartItems(items)
  }

  const handleCartItemsLoadAsync = async () => {
    const promises = new Array<Promise<any>>()

    promises.push(
      await new Promise<any>(async (resolve: any, rejec: any) => {
        await handleCartItems()
        resolve()
      })
    )

    Promise.all(promises).then(() => {
      setIsBasketFetched(true)
    })
  }

  const handleLoadAsync = async (preferredPaymentMethod: any) => {
    const promises = new Array<Promise<any>>()

    promises.push(
      await new Promise<any>(async (resolve: any, rejec: any) => {
        await fetchBasketReValidate()
        resolve()
      })
    )

    Promise.all(promises)
  }

  const handleToggleEngravingModal = (product?: any) => {
    if (product) setSelectedEngravingProduct(product)
    setTimeout(() => {
      setIsEngravingOpen(!isEngravingOpen)
    }, 200)
  }

  useEffect(() => {
    if (isBasketFetched) {
      let preferredPaymentMethod: any = undefined
      const userId = getUserId()
      if (isGuestUser || (userId && matchStrings(userId, Guid.empty, true))) {
        // preferredPaymentMethod = "";
      } else {
        // preferredPaymentMethod = getDefaultPaymentMethod();
      }
      // setPreferredPaymentMethod(preferredPaymentMethod);
      handleLoadAsync(preferredPaymentMethod)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBasketFetched, basketId, cartItems])

  useEffect(() => {
    const loadRelatedProducts = async () => {
      await new Promise<any>(async (resolve: any, reject: any) => {
        if (cartItems?.lineItems?.length) {
          const lastItemProductId =
            cartItems?.lineItems[cartItems?.lineItems?.length - 1]?.productId
          await fetchRelatedProducts(lastItemProductId)
        }
        resolve()
      })
    }
    loadRelatedProducts()
  }, [cartItems?.lineItems?.length])

  useEffect(() => {
    // const handleCartitems = async () => {
    //   const items = await getCart({ basketId })
    //   setCartItems(items)
    // }

    eventDispatcher(BasketViewed, {
      entity: JSON.stringify({
        id: basketId,
        grandTotal: cartItems.grandTotal?.raw.withTax,
        lineItems: cartItems.lineItems,
        promoCode: cartItems.promotionsApplied,
        shipCharge: cartItems.shippingCharge?.raw?.withTax,
        shipTax: cartItems.shippingCharge?.raw?.tax,
        taxPercent: cartItems.taxPercent,
        tax: cartItems.grandTotal?.raw?.tax,
      }),
      entityName: 'Cart',
      entityType: Basket,
      eventType: BasketViewed,
      promoCodes: cartItems.promotionsApplied,
    })
    // handleCartitems()
    handleCartItemsLoadAsync()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let totalPriceSaving = 0
    let updateQtySaving = 0
    cartItems?.lineItems?.forEach((product: any) => {
      if (product?.listPrice?.raw?.withTax > product?.price?.raw?.withTax) {
        const saving =
          product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
        updateQtySaving = saving * product?.qty
        totalPriceSaving = totalPriceSaving + updateQtySaving
      }
    })

    setTotalDiscount(totalPriceSaving + cartItems?.discount?.raw?.withTax)
    if (cartItems?.lineItems?.length > 0) {
      const lastCartItemProductId =
        cartItems?.lineItems[cartItems?.lineItems?.length - 1]?.productId
      setLastCartItemProductId(lastCartItemProductId)
    }
  }, [cartItems])

  const fetchRelatedProducts = async (productId?: string) => {
    const { data: relatedProducts }: any = await axios.post(
      NEXT_GET_ORDER_RELATED_PRODUCTS,
      {
        recordId: firstProductId,
      }
    )

    setRelatedProducts(relatedProducts)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const itemsInBag = () => {
    return cartItems?.lineItems
      ?.map((item: any) => item.qty)
      .reduce((sum: number, current: number) => sum + current, 0)
  }
  const relatedProductData = relatedProducts?.relatedProducts?.filter(
    (x: any) => x?.itemType != 10
  )

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

  const isAllItemsInStock = (reValidateResult: any) => {
    if (reValidateResult?.message) {
      const soldOutItems: any = tryParseJson(reValidateResult?.message)
      if (soldOutItems && soldOutItems?.length) {
        return false
      }
    }
    return true
  }

  const handleItem = (product: any, type = 'increase') => {
    if (isOpen && !(type === 'delete')) {
      closeModal()
    }
    const asyncHandleItem = async (product: any) => {
      const data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        if (product.qty < maxBasketItemsCount) {
          data.qty = 1
          if (currentPage) {
            if (typeof window !== 'undefined') {
              recordGA4Event(window, 'select_quantity', {
                category: product?.categoryItems?.length
                  ? product?.categoryItems[0]?.categoryName
                  : '',
                final_quantity: data.qty,
                current_page: currentPage,
                number_of_plus_clicked: 1,
                number_of_minus_clicked: 0,
              })
            }
          }
        } else {
          setAlert({
            type: 'error',
            msg: stringFormat(stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }), {
              maxBasketItemsCount,
            }),
          })
          return
        }
      }
      if (type === 'delete') {
        data.qty = 0
        if (typeof window !== 'undefined') {
          recordGA4Event(window, 'remove_from_cart', {
            ecommerce: {
              items: [
                {
                  item_name: product?.name,
                  price: product?.price?.raw?.withTax,
                  quantity: product?.qty,
                  item_id: product?.sku,
                  item_size: getLineItemSizeWithoutSlug(product),
                  item_brand: product?.brand,
                  item_variant: product?.colorName,
                  item_var_id: product?.stockCode,
                },
              ],
              loggedin: user?.userId && user?.userId !== Guid.empty,
              current_page: 'Cart',
            },
          })
        }
        if(window?.ch_session){
          window.ch_remove_from_cart_before({ item_id : product?.sku})
        }
      }
      try {
        const item = await addToCart(data, type, { product })
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
      if (isOpen && type === 'delete') {
        setLoadingAction(LoadingActionType.NONE)
        closeModal()
      }
    }
    if (product && product?.length) {
      product?.forEach((product: any) => {
        asyncHandleItem(product)
        setBasketReValidate([])
      })
    } else if (product?.productId) {
      asyncHandleItem(product)
    }
  }

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }

  const beginCheckout = (cartItems: any) => {
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'begin_checkout', {
        ecommerce: {
          items: [
            cartItems?.lineItems?.map((item: any, itemId: number) => ({
              item_name: item?.name,
              price: item?.price?.raw?.withTax,
              quantity: item?.qty,
              item_brand: item?.brand,
              item_id: item?.sku,
              item_size: getLineItemSizeWithoutSlug(item),
              item_variant: item?.colorName,
            })),
          ],
          current_page: 'Checkout',
          loggedin_status: user?.userId && user?.userId !== Guid.empty,
          paymode: '',
          address: '',
          value: cartItems?.grandTotal?.raw?.withTax,
          item_var_id: cartItems?.lineItems[0]?.stockCode,
        },
      })
    }
  }

  const getProductItemSizes = (product: any) => {
    const variantProductsAttribute = product?.variantProductsAttribute || product?.variantProductsAttributeMinimal || []
    if (variantProductsAttribute?.length) {
      //const attributes = variantProductsAttribute?.find((attr: { productId: string, variantAttributes: Array<any> }) => matchStrings(attr.productId, product?.productId, true));
      const size = variantProductsAttribute?.find((x: any) => matchStrings(x.fieldCode, 'clothing.size', true))
      return size?.fieldValues?.map((fv: any) => {
        return {
          ...fv,
          ...{ fieldValue: fv?.fieldValue?.toUpperCase() },
          //...{ fieldValue: fv?.fieldValue?.toUpperCase().startsWith("T") ? fv?.fieldValue?.substring(1).toUpperCase() : fv?.fieldValue },
        }
      })
    }
    return []
  }

  const bindProductSizes = async (product: any) => {
    const sizes = getProductItemSizes(product)
    const productSlug = product?.slug?.replace(PRODUCTS_SLUG_PREFIX, '')
    const { data: productDetails }: any = await axios.post(NEXT_GET_PRODUCT, { slug: productSlug?.startsWith('/') ? productSlug?.substring(1) : productSlug, })
    const correctSizes = productDetails?.product?.variantAttributes?.filter((attr: any) => attr.fieldCode === 'clothing.size')[0]?.fieldValues.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
    const stockCode = product?.stockCode
    if (stockCode) {
      const allSizeValues = sizes?.map((x: any) => x.fieldValue)
      const checkCorrectAttribute = (vPass: any) => vPass.filter((vpa: any) => vpa.fieldCode === 'clothing.size' && allSizeValues.includes(vpa.fieldValue))
      const variantProducts = productDetails?.product?.variantProducts?.filter((vp: any) => checkCorrectAttribute(vp.attributes).length > 0)
      setVariantProducts(variantProducts ?? [])
    }
    setProductSizes(correctSizes)
  }

  const handleQuickAddToBag = async (product: any, type?: any) => {
    await bindProductSizes(product)
    setIsSizeDialogOpen(true)
    setSelectedProduct(product)
    setSizeDialogState((v: any) => ({ ...v, type, }))
  }

  const handleClose = () => {
    setTimeout(() => closeSidebar(), 500)
    setCartSidebarOpen(false)
  }
  const isEmpty: boolean = cartItems?.lineItems?.length === 0
  const css = { maxWidth: '100%', height: 'auto' }
  function handleRedirectToPDP() { }
  return (
    <>
      <Transition.Root show={cartSidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-99" onClose={handleClose} >
          <div className="absolute inset-0 overflow-hidden z-99">
            <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Dialog.Overlay className="w-full h-screen bg-black/60 z-999" onClick={handleClose} />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full" >
                <div className="w-screen max-w-md">
                  <div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      <div className="sticky top-0 flex items-start justify-between px-4 py-4 mb-1 bg-white shadow z-99 sm:px-6">
                        <Dialog.Title className="text-lg font-medium text-gray-900 ">
                          {translate('label.basket.shoppingCartText')}
                          {itemsInBag() > 0 ? (
                            <span className="pl-2 mt-3 text-xs font-normal text-gray-400 dark:text-black"> {' '} {itemsInBag()}{' '} {itemsInBag() > 1 ? ' items' : ' item'}{' '} </span>
                          ) : (
                            <span className="pl-2 mt-3 text-xs font-normal text-gray-400 dark:text-black"> {' '}{translate('common.label.emptyText')}{' '} </span>
                          )}
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button type="button" className="p-2 -m-2 text-gray-400 hover:text-gray-500" onClick={handleClose} >
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      {/* {totalDiscount > 0 && cartItems.lineItems?.length > 0 && (
                        <div className="flex flex-col w-full px-4 py-1 border-b bg-cart-sidebar-green-light sm:px-4">
                          <h4 className="font-semibold text-green-dark">
                            {priceFormat(totalDiscount, undefined, cartItems?.discount?.currencySymbol)}{' '} {translate('label.basket.totalSavingsText')}
                          </h4>
                        </div>
                      )} */}
                      <div className="mt-2">
                        <div className="flow-root">
                          <ul role="list" className="px-4">
                            {cartItems.lineItems?.sort((lineItem1: any, lineItem2: any) => { return (lineItem1?.displayOrder - lineItem2?.displayOrder) })?.map((product: any) => {
                              const soldOutMessage = getCartValidateMessages(reValidateData?.messageCode, product)
                              return (
                                <li key={product.id} className="mb-2">
                                  <div className={`grid items-start grid-cols-12 gap-1 py-4 ${product?.price?.raw?.withTax == 0 ? 'bg-green-100 border border-emerald-300 rounded-lg p-2' : 'bg-white border-b border-slate-200 p-2'}`}>
                                    <div className="flex-shrink-0 col-span-3 overflow-hidden rounded-md">
                                      <Link href={`/${product.slug}`}>
                                        <img width={100} height={100} style={css} src={generateUri(product.image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={product.name || 'cart-image'} className="object-cover object-center w-full h-full" onClick={handleRedirectToPDP} />
                                      </Link>
                                    </div>
                                    <div className="flex flex-col flex-1 col-span-9 ml-4">
                                      <div className="flex flex-col flex-1">
                                        <div className="flex justify-between font-normal text-gray-900 font-sm">
                                          <h5 onClick={handleClose} className='text-base font-medium'>
                                            <Link href={`/${product.slug}`}> {' '} {product.name}{' '}</Link>
                                          </h5>
                                          <p className="mt-0 ml-4 font-semibold text-green">
                                            {product?.price?.raw?.withTax > 0 ?
                                              (isIncludeVAT ? product.price?.formatted?.withTax : product.price?.formatted?.withoutTax)
                                              : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'>FREE</span>
                                            }
                                          </p>
                                        </div>
                                        <div className='flex flex-col'>
                                          <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                                            {product?.colorName != "" &&
                                              <div className="flex items-center space-x-1.5">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                  <path d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M8.35 1.94995L9.69 3.28992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M2.07 11.92L17.19 11.26" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M3 22H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>{product?.colorName}</span>
                                              </div>
                                            }
                                            {product?.size != "" &&
                                              <>
                                                <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                                                <div className="flex items-center space-x-1.5">
                                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <path d="M21 9V3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 15V21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                                  <span className='uppercase'>{product?.size}</span>
                                                </div>
                                              </>
                                            }
                                          </div>
                                        </div>
                                        <div className="">
                                          {product.children?.map((child: any, idx: number) => {
                                            return (
                                              <div className="flex" key={idx} >
                                                <div className="flex flex-col mt-2 mb-6">
                                                  <div className="flex justify-between font-medium text-gray-900">
                                                    <div className="image-container">
                                                      <span className="align-middle cursor-pointer" onClick={() => { handleToggleEngravingModal(product) }} title={translate('common.label.viewPersonalisationText')} >
                                                        <EyeIcon className="inline-block w-4 h-4 hover:text-gray-400 lg:-mt-2 md:-mt-1 xsm:-mt-3 xsm:h-5" />
                                                      </span>
                                                    </div>
                                                    <p className="ml-1 mr-1 font-thin text-gray-500"> {' '} |{' '} </p>
                                                    <h3>
                                                      <span className="text-xs uppercase cursor-default">{translate('common.label.personalisationText')}</span>
                                                      <span className="mt-0 ml-4 text-xs"> {' '} {isIncludeVAT ? child.price?.formatted?.withTax : child.price?.formatted?.withoutTax}{' '} </span>
                                                    </h3>
                                                  </div>
                                                  <button type="button" className="-ml-32 text-xs font-medium text-indigo-600 hover:text-indigo-500" onClick={() => handleItem(child, translate('common.label.deleteText'))} >
                                                    {translate('common.label.removeText')}
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                        <div className="flex items-end justify-between text-sm">
                                          <div className="flex justify-between w-full mt-2">
                                            {product?.variantProducts?.length > 0 ? (
                                              <div role="button" onClick={handleToggleOpenSizeChangeModal.bind(null, product)} className='w-full'>
                                                <div className="border w-[fit-content] flex flex-row justify-between items-center py-2 px-2">
                                                  <p className="m-auto mr-1 text-sm text-gray-700">
                                                    Size:{' '}
                                                    <span className="uppercase"> {' '} {getLineItemSizeWithoutSlug(product)}{' '} </span>
                                                  </p>
                                                  <ChevronDownIcon className="w-4 h-4 text-black" />
                                                </div>
                                              </div>
                                            ) : (
                                              <div className='w-full'></div>
                                            )}
                                            {product?.price?.raw?.withTax > 0 &&
                                              <div className="flex flex-row items-center px-4 text-gray-900 border">
                                                <MinusSmallIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer" />
                                                <span className="px-2 py-2 text-md"> {product.qty} </span>
                                                <PlusSmallIcon className="w-4 cursor-pointer" onClick={() => handleItem(product, 'increase')} />
                                              </div>
                                            }
                                            <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                                              {reValidateData?.message != null && soldOutMessage != '' && (
                                                matchStrings(soldOutMessage, "sold out", true) ? (
                                                  <div className="flex flex-col col-span-12">
                                                    <div className="flex text-xs font-semibold text-left text-red-500">
                                                      <span className="relative mr-1">
                                                        <img
                                                          alt="Sold Out"
                                                          src="/assets/images/not-shipped-edd.svg"
                                                          width={20}
                                                          height={20}
                                                          className="relative inline-block mr-1 top-2"
                                                        />
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
                                          </div>
                                        </div>
                                        {product?.price?.raw?.withTax > 0 &&
                                          <div className="flex flex-row justify-between mt-3 \text-left">
                                            <button className="flex items-center gap-1 text-xs font-medium text-left text-gray-700 hover:text-black" onClick={() => { insertToLocalWishlist(product) }} disabled={isInWishList(product?.productId)} >
                                              {isInWishList(product?.productId) ? (
                                                <><HeartIcon className="w-4 h-4 text-sm text-red-500 hover:text-red-700" />{' '}{translate('label.product.wishlistedText')}</>
                                              ) : (
                                                <> <HeartIcon className="w-4 h-4 text-sm text-gray-500 dark:text-slate-400" />{' '}{translate('label.wishlist.moveToWishlistText')} </>
                                              )
                                              }
                                            </button>
                                            <button type="button" className="flex items-center gap-1 text-xs font-normal text-left text-red-400 group " onClick={() => { openModal(); setItemClicked(product) }} >
                                              <span className="relative z-10 flex items-center mt-0 text-sm font-medium text-primary-6000 hover:text-primary-500 ">{translate('common.label.removeText')}</span>
                                            </button>
                                          </div>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                            {isWishlistClicked && (
                              <div className="items-center justify-center w-full h-full py-5 text-xl text-gray-500">
                                <CheckCircleIcon className="flex items-center justify-center w-full h-12 text-center text-indigo-600" />
                                <p className="mt-5 text-center"> {' '} {translate('label.wishlist.addedToWishlistText')}{' '} </p>
                              </div>
                            )}
                          </ul>
                          {isEmpty && (
                            <div className="flex flex-col items-center justify-between w-full h-full py-9">
                              <img height="100" width="100" src="/assets/images/cart.jpg" alt="cart" className="text-center" />
                              <p className="mt-5 text-gray-700">{translate('common.label.noItemsPresentText')}</p>
                              <Link href="/search">
                                <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={handleClose} >
                                  {translate('label.basket.catalogText')}
                                  <span aria-hidden="true"> &rarr;</span>
                                </button>
                              </Link>
                              {altRelatedProducts?.relatedProducts && (
                                <div className="flex flex-col px-4 pb-10 mt-0 sm:px-8 sm:pb-16 cart-related-prod ">
                                  <RelatedProductWithGroup products={altRelatedProducts?.relatedProducts?.products?.results || []} productPerColumn={1.7} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
                                </div>
                              )}
                            </div>
                          )}
                          {isEmpty && (
                            <div className="px-4 cart-recently-viewed sm:px-8">
                              <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={1.4} />
                            </div>
                          )}
                          {!isEmpty && relatedProductData && (
                            <>
                              <div className="flex flex-col px-4 mt-0 cart-related-prod sm:px-6">
                                <RelatedProducts relatedProducts={relatedProductData} productPerColumn={1.8} checkout_refrence={true} title={translate('common.label.frequentlyBoughtTogetherText')} handleQuickAddToBag={handleQuickAddToBag} deviceInfo={deviceInfo} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <CartItemRemoveModal product={itemClicked} isOpen={isOpen} closeModal={closeModal} loadingAction={loadingAction} handleItem={handleItem} itemClicked={itemClicked} handleWishList={handleWishList} setLoadingAction={setLoadingAction} config={config} />
                    {!isEmpty &&
                      <div className="px-4 sm:px-4">
                        <PromotionInput basketPromos={basketPromos} items={cartItems} getBasketPromoses={getBasketPromos} />
                      </div>
                    }
                    {!isEmpty && (
                      <div className="px-5 text-sm divide-y mt-7 text-slate-500 dark:text-slate-400 divide-slate-200/70 dark:divide-slate-700/80">
                        <div className="flex justify-between py-2 text-sm text-gray-900">
                          <p className='text-sm'> {' '} {isIncludeVAT ? translate('label.orderSummary.subTotalTaxIncText') : translate('label.orderSummary.subTotalTaxExcText')}{' '} </p>
                          <p className='text-sm'> {' '} {isIncludeVAT ? cartItems.subTotal?.formatted?.withTax : cartItems.subTotal?.formatted?.withoutTax}{' '} </p>
                        </div>
                        <div className="flex justify-between py-2 text-sm text-gray-900">
                          <p className='text-sm'>{translate('label.orderSummary.shippingText')}</p>
                          <p className='text-sm'> {' '} {isIncludeVAT ? cartItems.shippingCharge?.formatted?.withTax : cartItems.shippingCharge?.formatted?.withoutTax}{' '} </p>
                        </div>

                        {cartItems.promotionsApplied?.length > 0 && (
                          <div className="flex justify-between py-2 text-sm text-gray-900">
                            <p className='text-sm'>{translate('label.orderSummary.discountText')}</p>
                            <p className="text-sm text-red-500"> {' '} {'-'}{' '} {isIncludeVAT ? cartItems.discount?.formatted?.withTax : cartItems.discount?.formatted?.withoutTax}{' '} </p>
                          </div>
                        )}
                        <div className="flex justify-between py-2 text-sm text-gray-900">
                          <p className='text-sm'>{translate('label.orderSummary.taxText')}</p>
                          <p className='text-sm'>{cartItems.grandTotal?.formatted?.tax}</p>
                        </div>
                        <div className="flex justify-between py-4 font-bold text-gray-900 font-20">
                          <p className="font-20 link-button">{translate('label.orderSummary.totalText')}</p>
                          <p className="font-20 link-button"> {' '} {cartItems.grandTotal?.formatted?.withTax}{' '} </p>
                        </div>
                      </div>
                    )}
                    {/* read-only engraving modal */}
                    {selectedEngravingProduct && (
                      <Engraving show={isEngravingOpen} showEngravingModal={setIsEngravingOpen} product={selectedEngravingProduct} handleToggleDialog={handleToggleEngravingModal} readOnly={true} />
                    )}
                    {cartItems.lineItems?.length > 0 &&
                      <div className="sticky bottom-0 z-10 w-full p-4 bg-white border-t shadow">
                        <Link href="/cart" onClick={() => {
                          handleClose()
                          beginCheckout(cartItems)
                        }} className="flex items-center justify-between py-2 capitalize transition rounded-full btn-primary btn">
                          <span className='flex flex-col justify-start pl-5 text-left'>
                            <span>{cartItems?.totalWithoutShipping?.formatted?.withTax}</span>
                            <span className='font-light font-12'>{translate('label.orderSummary.totalText')}</span>
                          </span>
                          <span className='flex items-center gap-2 pr-5'>
                            <span>{translate('label.orderSummary.placeOrderBtnText')}</span> <ArrowRightIcon className="w-4 h-4 text-white" />
                          </span>
                        </Link>
                      </div>
                    }
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
          <SizeChangeModal open={openSizeChangeModal} handleToggleOpen={handleToggleOpenSizeChangeModal} product={selectedProductOnSizeChange} />
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default CartSidebarView