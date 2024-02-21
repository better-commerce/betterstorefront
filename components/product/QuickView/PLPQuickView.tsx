import {
  Messages,
  NEXT_BULK_ADD_TO_CART,
  NEXT_CREATE_WISHLIST,
  NEXT_GET_PRODUCT,
  NEXT_GET_PRODUCT_QUICK_VIEW,
  NEXT_GET_PRODUCT_REVIEW,
  NEXT_UPDATE_CART_INFO,
  PRODUCTS_SLUG_PREFIX,
} from '@components/utils/constants'
import {
  BTN_ADD_TO_FAVORITES,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  CLOSE_PANEL,
  GENERAL_ADD_TO_BASKET,
  GENERAL_ENGRAVING,
  IMG_PLACEHOLDER,
  ITEM_TYPE_ADDON,
} from '@components/utils/textVariables'
import { Dialog, Transition } from '@headlessui/react'
import { HeartIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import Image from 'next/image'
import { generateUri } from '@commerce/utils/uri-util'
import Link from 'next/link'
import { round } from 'lodash'
import AttributesHandler from '../ProductView/AttributesHandler'
import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import cartHandler from '@components/services/cart'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { cartItemsValidateAddToCart, getCurrentPage, vatIncluded } from '@framework/utils/app-util'
import { matchStrings, stringFormat } from '@framework/utils/parse-util'

SwiperCore.use([Navigation])

var settings = {
  fade: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 8000,
  centerMode: false,
  dots: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
export default function PLPQuickView({
  isQuickview,
  setQuickview,
  productData,
  isQuickviewOpen,
  setQuickviewOpen,
  maxBasketItemsCount,
}: any) {
  const {
    openNotifyUser,
    addToWishlist,
    openWishlist,
    basketId,
    cartItems,
    setCartItems,
    user,
    setAlert,
  } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState<any>(undefined)
  const [close, setClose] = useState(isQuickviewOpen)
  const [updatedProduct, setUpdatedProduct] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>(undefined)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [variantInfo, setVariantInfo] = useState<any>({
    variantColour: '',
    variantSize: '',
  })
  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: quickViewData?.recordId,
    stockCode: quickViewData?.stockCode,
    ...quickViewData,
  })
  const [sizeInit, setSizeInit] = useState('')
  let currentPage = getCurrentPage()
  const product = updatedProduct || productData

  const handleSetProductVariantInfo = ({ colour, clothSize }: any) => {
    if (colour) {
      setVariantInfo((v: any) => ({
        ...v,
        variantColour: colour,
      }))
    }
    if (clothSize) {
      setVariantInfo((v: any) => ({
        ...v,
        variantSize: clothSize,
      }))
    }
  }

  const handleNotification = () => {
    openNotifyUser(product.recordId)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, selectedAttrData?.recordId, true) || matchStrings(o.productId, selectedAttrData?.productId, true)) {
            return o
          }
        })
        if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier && !selectedAttrData?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'], })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount,)
        if (!isValid) {
          setAlert({
            type: 'error', msg: stringFormat(Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'], { maxBasketItemsCount, }),
          })
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId: basketId,
            productId: selectedAttrData.productId,
            qty: 1,
            manualUnitPrice: product.price.raw.withTax,
            stockCode: selectedAttrData.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product: selectedAttrData }
        )
        setCartItems(item)
        setModalClose()
        if (typeof window !== 'undefined') {
          recordGA4Event(window, 'add_to_cart', {
            ecommerce: {
              items: [
                {
                  item_name: product?.name,
                  item_brand: product?.brand,
                  item_category2: product?.mappedCategories[1]?.categoryName,
                  item_variant: product?.variantGroupCode,
                  quantity: 1,
                  item_id: product?.productCode,
                  price: product?.price?.raw?.withTax,
                  item_var_id: product?.stockCode,
                  item_list_name: product?.mappedCategories[2]?.categoryName,
                  // index: position,
                },
              ],
              cart_quantity: 1,
              total_value: product?.price?.raw?.withTax,
              current_page: 'PLP ',
              section_title: 'Quick View',
            },
          })

          if (currentPage) {
            recordGA4Event(window, 'view_cart', {
              ecommerce: {
                items: cartItems?.lineItems?.map(
                  (items: any, itemId: number) => ({
                    item_name: items?.name,
                    item_id: items?.sku,
                    price: items?.price?.raw?.withTax,
                    item_brand: items?.brand,
                    item_category2: items?.categoryItems?.length
                      ? items?.categoryItems[1]?.categoryName
                      : '',
                    item_variant: items?.colorName,
                    item_list_name: items?.categoryItems?.length
                      ? items?.categoryItems[0]?.categoryName
                      : '',
                    item_list_id: '',
                    index: itemId,
                    quantity: items?.qty,
                    item_var_id: items?.stockCode,
                  })
                ),
                // device: deviceCheck,
                current_page: currentPage,
              },
            })
          }
        }
      },
      shortMessage: '',
    }
    if (selectedAttrData?.currentStock <= 0 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory) {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
    } else if (
      product?.preOrder?.isEnabled &&
      selectedAttrData?.currentStock <= 0
    ) {
      if (
        product.preOrder.currentStock < product.preOrder.maxStock &&
        (!product.flags.sellWithoutInventory ||
          selectedAttrData.sellWithoutInventory)
      ) {
        buttonConfig.title = BTN_PRE_ORDER
        buttonConfig.shortMessage = product.preOrder.shortMessage
        return buttonConfig
      } else if (
        product.flags.sellWithoutInventory ||
        selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig = {
          title: GENERAL_ADD_TO_BASKET,
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === selectedAttrData?.productId?.toUpperCase())
            if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier && !selectedAttrData?.flags?.sellWithoutInventory) {
              setAlert({
                type: 'error',
                msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
              })
              return false
            }
            const isValid = cartItemsValidateAddToCart(
              cartItems,
              maxBasketItemsCount
            )
            if (!isValid) {
              setAlert({
                type: 'error',
                msg: stringFormat(
                  Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
                  { maxBasketItemsCount }
                ),
              })
            }
            return isValid
          },
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: selectedAttrData.productId,
                qty: 1,
                manualUnitPrice: product.price.raw.withTax,
                stockCode: selectedAttrData.stockCode,
                userId: user.userId,
                isAssociated: user.isAssociated,
              },
              'ADD',
              { product: selectedAttrData }
            )
            setCartItems(item)
            if (typeof window !== 'undefined') {
              recordGA4Event(window, 'add_to_cart', {
                ecommerce: {
                  items: [
                    {
                      item_name: product?.name,
                      item_brand: product?.brand,
                      item_category2:
                        product?.mappedCategories[1]?.categoryName,
                      item_variant: product?.variantGroupCode,
                      quantity: 1,
                      item_id: product?.productCode,
                      price: product?.price?.raw?.withTax,
                      item_var_id: product?.stockCode,
                      item_list_name:
                        product?.mappedCategories[2]?.categoryName,
                      // index: position,
                    },
                  ],
                  cart_quantity: 1,
                  total_value: product?.price?.raw?.withTax,
                  current_page: 'PLP ',
                  section_title: 'Quick View',
                },
              })

              if (currentPage) {
                recordGA4Event(window, 'view_cart', {
                  ecommerce: {
                    items: cartItems?.lineItems?.map(
                      (items: any, itemId: number) => ({
                        item_name: items?.name,
                        item_id: items?.sku,
                        price: items?.price?.raw?.withTax,
                        item_brand: items?.brand,
                        item_category2: items?.categoryItems?.length
                          ? items?.categoryItems[1]?.categoryName
                          : '',
                        item_variant: items?.colorName,
                        item_list_name: items?.categoryItems?.length
                          ? items?.categoryItems[0]?.categoryName
                          : '',
                        item_list_id: '',
                        index: itemId,
                        quantity: items?.qty,
                        item_var_id: items?.stockCode,
                      })
                    ),
                    // device: deviceCheck,
                    current_page: currentPage,
                  },
                })
              }
            }
          },
          shortMessage: '',
        }
      } else {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
        return buttonConfig
      }
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = () => {
    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }

    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'wishlist', {
        ecommerce: {
          header: 'PLP',
          current_page: 'Quick view ',
        },
      })

      recordGA4Event(window, 'add_to_wishlist', {
        ecommerce: {
          items: [
            {
              item_name: product?.name,
              item_brand: product?.brand,
              item_category: product?.classification?.mainCategoryName,
              item_category2: product?.classification?.category,
              item_variant: product?.variantGroupCode,
              quantity: 1,
              item_id: product?.sku,
              price: product?.price?.raw?.withTax,
            },
          ],
          item_var_id: product?.stockCode,
          header: 'Quick View',
          current_page: 'Quick View',
          availability: productAvailability,
        },
      })
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'wishlist', {
          ecommerce: {
            header: 'Quick View',
            current_page: currentPage,
          },
        })
      }
    }

    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product.recordId,
            flag: true,
          })
          insertToLocalWishlist()
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }
  const handleEngravingSubmit = (values: any) => {
    const updatedProduct = {
      ...product,
      ...{
        recordId: selectedAttrData.productId,
        stockCode: selectedAttrData.stockCode,
      },
    }
    const addonProducts = product.relatedProducts?.filter(
      (item: any) => item.stockCode === ITEM_TYPE_ADDON
    )
    const addonProductsWithParentProduct = addonProducts.map((item: any) => {
      item.parentProductId = product.recordId
      return item
    })
    const computedProducts = [
      ...addonProductsWithParentProduct,
      updatedProduct,
    ].reduce((acc: any, obj: any) => {
      acc.push({
        ProductId: obj.recordId || obj.productId,
        BasketId: basketId,
        ParentProductId: obj.parentProductId || null,
        Qty: 1,
        DisplayOrder: obj.displayOrder || 0,
        StockCode: obj.stockCode,
        ItemType: obj.itemType || 0,
        CustomInfo1: values.line1 || null,

        CustomInfo2: values.line2 || null,

        CustomInfo3: values.line3 || null,

        CustomInfo4: values.line4 || null,

        CustomInfo5: values.line5 || null,

        ProductName: obj.name,

        ManualUnitPrice: obj.manualUnitPrice || 0.0,

        PostCode: obj.postCode || null,

        IsSubscription: obj.subscriptionEnabled || false,

        IsMembership: obj.hasMembership || false,

        SubscriptionPlanId: obj.subscriptionPlanId || null,

        SubscriptionTermId: obj.subscriptionTermId || null,

        UserSubscriptionPricing: obj.userSubscriptionPricing || 0,

        GiftWrapId: obj.giftWrapConfig || null,

        IsGiftWrapApplied: obj.isGiftWrapApplied || false,

        ItemGroupId: obj.itemGroupId || 0,

        PriceMatchReqId:
          obj.priceMatchReqId || '00000000-0000-0000-0000-000000000000',
      })
      return acc
    }, [])

    const asyncHandler = async () => {
      try {
        const newCart = await axios.post(NEXT_BULK_ADD_TO_CART, {
          basketId,
          products: computedProducts,
        })
        await axios.post(NEXT_UPDATE_CART_INFO, {
          basketId,
          info: [...Object.values(values)],
          lineInfo: computedProducts,
        })

        setCartItems(newCart.data)
        showEngravingModal(false)
      } catch (error) {
        console.log(error, 'err')
      }
    }
    asyncHandler()
  }

  const isEngravingAvailable = !!product?.relatedProducts?.filter(
    (item: any) => item?.stockCode === ITEM_TYPE_ADDON
  ).length

  const fetchProduct = async () => {
    if (productData?.slug) {
      const productSlug = product?.slug?.replace(PRODUCTS_SLUG_PREFIX, '')
      // const response: any = await axios.post(NEXT_GET_PRODUCT, { slug: productData?.slug })
      const response: any = await axios.post(NEXT_GET_PRODUCT, {
        slug: productSlug?.startsWith('/')
          ? productSlug?.substring(1)
          : productSlug,
      })
      if (response?.data?.product) {
        setUpdatedProduct(response?.data?.product)
        setSelectedAttrData({
          productId: response?.data?.product?.recordId,
          stockCode: response?.data?.product?.stockCode,
          ...response?.data?.product,
        })
      }
    }
  }
  const fetchIsQuickView = () => {
    if (isQuickview) {
      const loadView = async (slug: string) => {
        const { data: productQuickViewData }: any = await axios.post(
          NEXT_GET_PRODUCT_QUICK_VIEW,
          { slug: slug }
        )

        const { data: reviewData }: any = await axios.post(
          NEXT_GET_PRODUCT_REVIEW,
          { recordId: productQuickViewData?.product?.recordId }
        )

        const data = productQuickViewData?.product
        setQuickViewData(productQuickViewData?.product)
        setReviewData(reviewData?.review)
        if (data) {
          setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
        }
        // console.log('QUICKVIEW_PRODUCTDATA:',productQuickViewData?.product)
      }

      if (productData?.slug) loadView(productData?.slug)
    } else {
      setQuickViewData(undefined)
    }
    return [isQuickview]
  }

  const handleFetchProductQuickView = (slug: string) => {
    if(isQuickview){
      const loadView = async (slug:string) => {
        const { data: productQuickViewData }: any = await axios.post( NEXT_GET_PRODUCT_QUICK_VIEW, { slug: slug } )
        const data = productQuickViewData?.product
        const { data: reviewData }: any = await axios.post( NEXT_GET_PRODUCT_REVIEW, { recordId: data?.recordId } )
        setQuickViewData(data)
        setReviewData(reviewData?.review)
        if (data) {
          setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
        }
      }
      if (slug) loadView(slug)
    }
    return [isQuickview]
  }

  useEffect(() => {
    if (!isQuickview) return
    fetchProduct()
    fetchIsQuickView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuickview])

  const setModalClose = () => {
    setSelectedAttrData(undefined)
    setQuickViewData(undefined)
    setQuickviewOpen(false)
  }

  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)

  if (!product) {
    return null
  }

  return (
    <>
      <Transition.Root show={isQuickviewOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-999" onClose={() => setModalClose()} >
          <div className="absolute inset-0 overflow-hidden z-999">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Dialog.Overlay className="w-full h-screen bg-black opacity-50" onClick={() => setModalClose()} />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
                <div className="w-screen max-w-xl p-2 quickview-screen">
                  <div className="flex flex-col h-full rounded-md shadow-xl bg-gray-50">
                    <div className="flex-1 px-0">
                      <div className="relative py-2 mt-2 sm:px-0">
                        <button type="button" className="absolute -top-11 right-0 lg:-top-2 lg:-right-8 p-0.5 bg-gray-300 rounded-full" onClick={() => setModalClose()} >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                          <div className="lg:col-span-6">
                            <div className="flex flex-col px-4 sm:px-6 sm:pb-3">
                              <Swiper slidesPerView={1} spaceBetween={4} navigation={true} loop={false} breakpoints={{ 640: { slidesPerView: 1, }, 768: { slidesPerView: 1, }, 1024: { slidesPerView: 1, }, }} >
                                {productData?.images?.length > 0 ? (<>
                                  <div role="list" className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-12 lg:gap-x-0" >
                                    {productData?.images?.map((image: any, idx: number) => image?.tag != 'specification' && (
                                      <SwiperSlide className="px-0" key={`${idx}-slider`} >
                                        <div key={idx} className="inline-flex flex-col w-full text-center cursor-pointer lg:w-auto" >
                                          <div className="relative group">
                                            {image?.image ? (
                                              <div className="image-container">
                                                <img src={generateUri(image?.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER} alt={image.name || 'product-image'} className="object-cover object-center w-full h-full image" />
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </div>
                                      </SwiperSlide>
                                    ))}
                                  </div>
                                </>) : (<>
                                  <div role="list" className="inline-flex mx-0 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-1 lg:gap-x-0" >
                                    {productData?.images?.length == 0 &&
                                      <div className="inline-flex flex-col w-full text-center cursor-pointer lg:w-auto" >
                                        <div className="relative group">
                                          <div className="image-container">
                                            <img src={IMG_PLACEHOLDER} alt="Dummy Image" className="object-cover object-center w-full h-full image" />
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </>)}
                              </Swiper>
                            </div>
                          </div>
                          <div className="lg:col-span-6">
                            <div className="flex flex-col px-4 my-1 sm:px-6">
                              <h4 className="text-xs font-normal text-gray-400">
                                {productData?.classification?.category}
                              </h4>
                              <h3 className="grid grid-cols-12 mb-2 text-sm font-bold tracking-tight lg:text-xl md:text-xl text-primary sm:text-2xl sm:grid-cols-6">
                                <div className="col-span-8 text-sm sm:col-span-4 sm:text-sm md:text-sm lg:text-lg">
                                  <Link href={`/${productData?.slug}`} passHref onClick={() => setQuickview(undefined)} >
                                    {productData?.name || productData?.name}{' '}
                                  </Link>
                                </div>
                                <div className="col-span-4 pr-2 font-semibold text-right sm:col-span-2 sm:pr-0">
                                  {reviewData?.totalRecord > 0 ? (
                                    <>
                                      <StarIcon className="relative inline-block w-4 h-4 text-yellow-600 -top-1" />
                                      <span className="relative inline-block pl-1 text-xs -top-1 text-primary">
                                        {productData?.rating} (
                                        {reviewData?.totalRecord})
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <StarIcon className="relative inline-block w-4 h-5 text-yellow-600 -top-1" />
                                      <span className="relative inline-block pl-1 text-xs text-gray-400 -top-1">
                                        {productData?.rating}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </h3>
                            </div>
                            <div className="flex flex-col px-4 mt-1 sm:px-6">
                              <p className="mb-2 text-lg font-semibold text-primary sm:text-md">
                                {isIncludeVAT ? productData?.price?.formatted?.withTax : productData?.price?.formatted?.withoutTax}
                                {productData?.listPrice?.raw?.withTax > 0 && productData?.listPrice?.raw?.withTax > productData?.price?.raw?.withTax && (
                                  <>
                                    <span className="px-2 text-lg font-normal text-gray-500 line-through sm:text-md">
                                      {isIncludeVAT ? productData?.listPrice?.formatted?.withTax : productData?.listPrice?.formatted?.withoutTax}
                                    </span>
                                    <span className="text-lg font-normal text-red-500 sm:text-md">
                                      {discount}% off
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div className="flex flex-col px-4 py-4 sm:px-6">
                              {updatedProduct ? (
                                <>
                                 {quickViewData &&
                                    <AttributesHandler 
                                      product={quickViewData} 
                                      variant={selectedAttrData} 
                                      setSelectedAttrData={setSelectedAttrData} 
                                      variantInfo={variantInfo} 
                                      handleSetProductVariantInfo={ handleSetProductVariantInfo }
                                      handleFetchProductQuickView = {handleFetchProductQuickView}
                                      isQuickView={true}
                                      sizeInit={sizeInit} 
                                      setSizeInit={setSizeInit} />
                                 }
                                  {!isEngravingAvailable && (
                                    <div className="flex mt-6 sm:mt-4 sm:flex-col1 !text-sm">
                                      <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                                      <button type="button" onClick={() => { if (!isInWishList) { handleWishList() } }} className="flex items-center justify-center ml-4 border border-gray-300 hover:bg-red-50 hover:text-pink hover:border-pink btn">
                                        {isInWishList ? (
                                          <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                                        ) : (
                                          <HeartIcon className="flex-shrink-0 w-6 h-6" />
                                        )}
                                        <span className="sr-only"> {BTN_ADD_TO_FAVORITES} </span>
                                      </button>
                                    </div>
                                  )}

                                  {isEngravingAvailable && (
                                    <>
                                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                        <Button className="block py-3 sm:hidden" title={buttonConfig.title} action={buttonConfig.action} buttonType={ buttonConfig.type || 'cart' } />
                                      </div>
                                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                        <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} buttonType={ buttonConfig.type || 'cart' } />
                                        <button className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white uppercase bg-gray-400 border border-transparent rounded-sm sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full" onClick={() => showEngravingModal(true) } >
                                          <span className="font-bold"> {GENERAL_ENGRAVING} </span>
                                        </button>
                                        <button type="button" onClick={() => { if (!isInWishList) { handleWishList() } }} className="flex items-center justify-center px-4 py-2 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink" >
                                          {isInWishList ? (
                                            <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                                          ) : (
                                            <HeartIcon className="flex-shrink-0 w-6 h-6" />
                                          )}
                                          <span className="sr-only">
                                            {BTN_ADD_TO_FAVORITES}
                                          </span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div >
        </Dialog >
      </Transition.Root >
    </>
  )
}
