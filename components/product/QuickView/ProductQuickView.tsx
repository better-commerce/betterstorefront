import { NEXT_BULK_ADD_TO_CART, NEXT_CREATE_WISHLIST, NEXT_GET_PRODUCT, NEXT_GET_PRODUCT_QUICK_VIEW, NEXT_UPDATE_CART_INFO, PRODUCTS_SLUG_PREFIX, Messages } from '@components/utils/constants'
import { IMG_PLACEHOLDER, ITEM_TYPE_ADDON } from '@components/utils/textVariables'
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
import { stringFormat } from '@framework/utils/parse-util'
import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
import cartHandler from '@components/services/cart'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage, validateAddToCart, vatIncluded } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
const Button = dynamic(() => import('@components/ui/IndigoButton'))

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
export default function ProductQuickView({
  isQuickview,
  setQuickview,
  productData,
  isQuickviewOpen,
  setQuickviewOpen,
  maxBasketItemsCount,
}: any) {
  const translate = useTranslation()
  const [quickViewData, setQuickViewData] = useState<any>(undefined)
  const [close, setClose] = useState(isQuickviewOpen)
  const [updatedProduct, setUpdatedProduct] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>(undefined)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: quickViewData?.recordId,
    stockCode: quickViewData?.stockCode,
    ...quickViewData,
  })
  const product = updatedProduct || productData
  const handleNotification = () => {
    openNotifyUser(product.recordId)
  }
  const {
    openNotifyUser,
    addToWishlist,
    openWishlist,
    basketId,
    cartItems,
    setCartItems,
    setAlert,
    user,
    openCart,
  } = useUI()
  const isIncludeVAT = vatIncluded()
  let currentPage = getCurrentPage()

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find(
          (o: any) => o.productId === selectedAttrData?.productId.toUpperCase()
        )
        if (selectedAttrData?.currentStock === cartLineItem?.qty) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
          })
          return false
        }
        const isValid = validateAddToCart(
          selectedAttrData?.productId ?? selectedAttrData?.recordId,
          cartItems,
          maxBasketItemsCount
        )
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: stringFormat(stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }), {
              maxBasketItemsCount,
            }),
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
    if (selectedAttrData.currentStock <= 0 && !product.preOrder.isEnabled) {
      if (
        !product.flags.sellWithoutInventory ||
        !selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig.title = translate('label.product.notifyMeText')
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
      }
    } else if (
      product?.preOrder?.isEnabled &&
      selectedAttrData?.currentStock <= 0
    ) {
      if (
        product.preOrder.currentStock < product.preOrder.maxStock &&
        (!product.flags.sellWithoutInventory ||
          selectedAttrData.sellWithoutInventory)
      ) {
        buttonConfig.title = translate('label.product.preOrderText')
        buttonConfig.shortMessage = product.preOrder.shortMessage
        return buttonConfig
      } else if (
        product.flags.sellWithoutInventory ||
        selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig = {
          title: translate('label.basket.addToBagText'),
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find(
              (o: any) =>
                o.productId === selectedAttrData?.productId.toUpperCase()
            )
            if (selectedAttrData?.currentStock === cartLineItem?.qty) {
              setAlert({
                type: 'error',
                msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
              })
              return false
            }
            const isValid = validateAddToCart(
              selectedAttrData?.productId ?? selectedAttrData?.recordId,
              cartItems,
              maxBasketItemsCount
            )
            if (!isValid) {
              setAlert({
                type: 'error',
                msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }),

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
        buttonConfig.title = translate('label.product.notifyMeText')
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

      // console.log('QUICKVIEW_FETCHPRODUCT_RES:',response)
      // if (response?.data?.product) {
      //   setUpdatedProduct(response?.data?.product)
      //   setSelectedAttrData({
      //     productId: response?.data?.product?.recordId,
      //     stockCode: response?.data?.product?.stockCode,
      //     ...response?.data?.product,
      //   })
      //   const attr = {
      //     productId: response?.data?.product?.recordId,
      //     stockCode: response?.data?.product?.stockCode,
      //     ...response?.data?.product,
      //   }
      //   // console.log('QUICKVIEW_SELECTEDATTR:',attr)
      // }
    }
  }
  const fetchIsQuickView = () => {
    if (isQuickviewOpen) {
      //if(isQuickview)
      const loadView = async (slug: string) => {
        const { data: productQuickViewData }: any = await axios.post(
          NEXT_GET_PRODUCT_QUICK_VIEW,
          { slug: slug }
        )

        // const { data: reviewData }: any = await axios.post(
        //   NEXT_GET_PRODUCT_REVIEW,
        //   { recordId: productQuickViewData?.product?.recordId }
        // )

        setQuickViewData(productQuickViewData?.product)
        if (productQuickViewData?.product) {
          setUpdatedProduct(productQuickViewData.product)
          setSelectedAttrData({
            productId: productQuickViewData.product?.recordId,
            stockCode: productQuickViewData.product?.stockCode,
            ...productQuickViewData.product,
          })
          const attr = {
            productId: productQuickViewData.product?.recordId,
            stockCode: productQuickViewData.product?.stockCode,
            ...productQuickViewData.product,
          }
        }
        // setReviewData(reviewData?.review)
        // console.log("SLUG: ",slug,'\nQUICKVIEW_PRODUCTDATA:',productQuickViewData?.product)
      }

      if (productData?.slug) loadView(productData?.slug)
    } else {
      setQuickViewData(undefined)
    }
    return [isQuickview]
  }

  useEffect(() => {
    fetchProduct()
    fetchIsQuickView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData?.slug])

  if (!product) {
    return null
  }

  const setModelClose = () => {
    setQuickviewOpen(false)
  }
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  return (
    <>
      <Transition.Root show={isQuickviewOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-999"
          onClose={() => setModelClose()}
        >
          <div className="absolute inset-0 overflow-hidden z-999">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="w-full h-screen bg-black opacity-50"
                onClick={() => setModelClose()}
              />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="w-screen max-w-xl">
                  <div className="flex flex-col h-full overflow-y-auto rounded shadow-xl bg-gray-50">
                    <div className="flex-1 px-0 overflow-y-auto">
                      <div className="sticky top-0 z-10 flex items-start justify-between w-full px-6 py-4 border-b shadow bg-indigo-50">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {translate('label.product.quickViewText')}
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setModelClose()}
                          >
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="py-2 mt-2 sm:px-0">
                        <div className="grid grid-cols-1 sm:grid-cols-12">
                          <div className="sm:col-span-5">
                            <div className="flex flex-col px-4 sm:px-6 sm:pb-3">
                              <Swiper
                                slidesPerView={1.2}
                                spaceBetween={4}
                                navigation={true}
                                loop={false}
                                breakpoints={{
                                  640: {
                                    slidesPerView: 1.2,
                                  },
                                  768: {
                                    slidesPerView: 1,
                                  },
                                  1024: {
                                    slidesPerView: 1.2,
                                  },
                                }}
                              >
                                <div
                                  role="list"
                                  className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0"
                                >
                                  {productData?.images?.map(
                                    (image: any, idx: number) =>
                                      image?.tag != 'specification' && (
                                        <SwiperSlide
                                          className="px-0"
                                          key={`${idx}-slider`}
                                        >
                                          <div
                                            key={idx}
                                            className="inline-flex flex-col w-full text-center cursor-pointer lg:w-auto"
                                          >
                                            <div className="relative group long-image">
                                              {image?.image ? (
                                                <div className="image-container">
                                                  <Image
                                                    priority
                                                    src={
                                                      generateUri(
                                                        image?.image,
                                                        'h=1000&fm=webp'
                                                      ) || IMG_PLACEHOLDER
                                                    }
                                                    alt={image.name || 'slider-image'}
                                                    className="object-cover object-center w-full h-full image pdp-image"
                                                    fill
                                                    sizes="320 600 1000"
                                                    blurDataURL={
                                                      `${image?.image}?h=600&w=400&fm=webp` ||
                                                      IMG_PLACEHOLDER
                                                    }
                                                  />
                                                </div>
                                              ) : (
                                                <PlayIcon className="object-cover object-center w-full h-full" />
                                              )}
                                            </div>
                                          </div>
                                        </SwiperSlide>
                                      )
                                  )}
                                </div>
                              </Swiper>
                            </div>
                          </div>
                          <div className="sm:col-span-7">
                            <div className="flex flex-col px-4 my-1 sm:px-6">
                              <h4 className="text-xs font-normal text-gray-400">
                                {productData?.classification?.category}
                              </h4>
                              <h1 className="grid grid-cols-12 mb-2 text-xl font-bold tracking-tight text-primary sm:text-2xl sm:grid-cols-6">
                                <div className="col-span-8 sm:col-span-4">
                                  <Link
                                    href={`/${productData?.slug}`}
                                    passHref
                                    onClick={() => setQuickview(undefined)}
                                  >
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
                              </h1>
                            </div>
                            <div className="flex flex-col px-4 mt-1 sm:px-6">
                              <p className="mb-2 text-lg font-semibold text-primary sm:text-md">
                                {isIncludeVAT
                                  ? productData?.price?.formatted?.withTax
                                  : productData?.price?.formatted?.withoutTax}

                                {productData?.listPrice?.raw?.withTax > 0 && productData?.listPrice?.raw?.withTax > productData?.price?.raw?.withTax && (
                                  <>
                                    <span className="px-2 text-lg font-normal text-gray-500 line-through sm:text-md">
                                      {isIncludeVAT
                                        ? productData?.listPrice?.formatted
                                            ?.withTax
                                        : productData?.listPrice?.formatted
                                            ?.withoutTax}
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
                                  {!isEngravingAvailable && (
                                    <div className="flex mt-6 sm:mt-0 sm:flex-col1">
                                      <Button
                                        title={buttonConfig.title}
                                        action={buttonConfig.action}
                                        validateAction={
                                          buttonConfig.validateAction
                                        }
                                        buttonType={buttonConfig.type || 'cart'}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isInWishList) {
                                            handleWishList()
                                          }
                                        }}
                                        className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                                      >
                                        {isInWishList ? (
                                          <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                                        ) : (
                                          <HeartIcon className="flex-shrink-0 w-6 h-6" />
                                        )}
                                        <span className="sr-only">
                                          {translate('label.product.addTofavouriteText')}
                                        </span>
                                      </button>
                                    </div>
                                  )}

                                  {isEngravingAvailable && (
                                    <>
                                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                        <Button
                                          className="block py-3 sm:hidden"
                                          title={buttonConfig.title}
                                          action={buttonConfig.action}
                                          buttonType={
                                            buttonConfig.type || 'cart'
                                          }
                                        />
                                      </div>
                                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                        <Button
                                          className="hidden sm:block "
                                          title={buttonConfig.title}
                                          action={buttonConfig.action}
                                          buttonType={
                                            buttonConfig.type || 'cart'
                                          }
                                        />
                                        <button
                                          className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white uppercase bg-gray-400 border border-transparent rounded-sm sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                                          onClick={() =>
                                            showEngravingModal(true)
                                          }
                                        >
                                          <span className="font-bold">
                                          {translate('label.product.engravingText')}
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!isInWishList) {
                                              handleWishList()
                                            }
                                          }}
                                          className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                                        >
                                          {isInWishList ? (
                                            <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                                          ) : (
                                            <HeartIcon className="flex-shrink-0 w-6 h-6" />
                                          )}
                                          <span className="sr-only">
                                            {translate('label.product.addTofavouriteText')}
                                          </span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : null}
                              {/* <AttributesHandler
                            product={productData}
                            variant={selectedAttrData}
                            setSelectedAttrData={setSelectedAttrData}
                          /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
