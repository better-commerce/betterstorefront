import { MAX_ADD_TO_CART_LIMIT, Messages, NEXT_BULK_ADD_TO_CART, NEXT_CREATE_WISHLIST, NEXT_GET_PRODUCT, NEXT_GET_PRODUCT_QUICK_VIEW, NEXT_GET_PRODUCT_REVIEW, NEXT_UPDATE_CART_INFO } from '@components/utils/constants'
import { BTN_ADD_TO_FAVORITES, BTN_NOTIFY_ME, BTN_PRE_ORDER, GENERAL_ENGRAVING, IMG_PLACEHOLDER, ITEM_TYPE_ADDON } from '@components/utils/textVariables'
import { Tab } from '@headlessui/react'
import { Dialog, Transition } from '@headlessui/react'
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { generateUri } from '@commerce/utils/uri-util'
import Link from 'next/link'
import { round } from 'lodash'
import AttributesHandler from '../ProductView/AttributesHandler'
import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
import cartHandler from '@components/services/cart'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { cartItemsValidateAddToCart, getCurrentPage, vatIncluded } from '@framework/utils/app-util'
import ImageGallery from 'react-image-gallery'
import { matchStrings } from '@framework/utils/parse-util'
import ButtonNotifyMe from '../ButtonNotifyMe'
import { isMobile } from 'react-device-detect'
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
export default function SearchQuickView({ isQuickview, setQuickview, productData, isQuickviewOpen, setQuickviewOpen, maxBasketItemsCount }: any) {
  const translate = useTranslation()
  const { openNotifyUser, addToWishlist, openWishlist, basketId, cartItems, setCartItems, user, setAlert } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState<any>(undefined)
  const [close, setClose] = useState(isQuickviewOpen)
  const [updatedProduct, setUpdatedProduct] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>(undefined)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [quantity, setQuantity] = useState(1)

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
  const product = updatedProduct || quickViewData

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
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, quickViewData?.recordId, true) || matchStrings(o.productId, quickViewData?.productId, true)) {
            return o
          }
        })
        if (quickViewData?.currentStock === cartLineItem?.qty && !quickViewData?.fulfilFromSupplier && !quickViewData?.flags?.sellWithoutInventory) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
          })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount)
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
          })
          return false
        }
        return isValid;
      },
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId: basketId,
            productId: quickViewData?.productId,
            qty: quantity,
            manualUnitPrice: quickViewData?.price?.raw?.withoutTax,
            stockCode: quickViewData?.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product: quickViewData }
        )
        setCartItems(item)
        setModelClose()
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
    if (
      product?.preOrder?.isEnabled &&
      product?.currentStock <= 0
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
          title: translate('label.basket.addToBagText'),
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
              if (matchStrings(o.productId, quickViewData?.recordId, true) || matchStrings(o.productId, quickViewData?.productId, true)) {
                return o
              }
            })
            if (quickViewData?.currentStock === cartLineItem?.qty && !quickViewData?.fulfilFromSupplier && !quickViewData?.flags?.sellWithoutInventory) {
              setAlert({
                type: 'error',
                msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
              })
              return false
            }
            const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount)
            if (!isValid) {
              setAlert({
                type: 'error',
                msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
              })
              return false
            }
            return isValid;
          },
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: quickViewData?.productId,
                qty: 1,
                manualUnitPrice: quickViewData?.price?.raw?.withoutTax,
                stockCode: quickViewData?.stockCode,
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
    if (quickViewData?.link) {
      const productSlug = quickViewData?.link
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
          { recordId: productData?.objectid?.raw }
        )

        setQuickViewData(productQuickViewData?.product)
        setReviewData(reviewData?.review)
      }

      if (productData?.weburl?.raw) loadView(productData?.weburl?.raw)
    } else {
      setQuickViewData(undefined)
    }
    return [isQuickview]
  }

  useEffect(() => {
    fetchProduct()
    fetchIsQuickView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData?.weburl?.raw])

  const setModelClose = () => {
    setQuickviewOpen()
  }

  if (!product) {
    return null
  }
  const images = quickViewData?.images?.map((image: any) => {
    return {
      original: image?.image,
      thumbnail: image?.image,
    }
  })
  const saving =
    (isIncludeVAT
      ? quickViewData?.listPrice?.raw?.withTax
      : quickViewData?.listPrice?.raw?.withoutTax) -
    (isIncludeVAT
      ? quickViewData?.price?.raw?.withTax
      : quickViewData?.price?.raw?.withoutTax)
  const discount = round(
    (saving /
      (isIncludeVAT
        ? quickViewData?.listPrice?.raw?.withTax
        : quickViewData?.listPrice?.raw?.withoutTax)) *
    100,
    0
  )

  const customRenderItem = (item: any) => {
    return (
      <div className="flex justify-center image-gallery-image">
        <img
          src={generateUri(item?.original, "h=1000&fm=webp") || IMG_PLACEHOLDER}
          alt={product?.name || 'product'}
          height={1000}
          width={1000}
          className="!object-contain"
        />
      </div>
    )
  }
  const customRenderThumbInner = (item: any) => {
    return (
      <img
        src={generateUri(item?.thumbnail, 'h=300&fm=webp') || IMG_PLACEHOLDER}
        alt={product?.name || 'product'}
        height={100}
        width={100}
      />
    )
  }

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
                className="w-full h-screen bg-black opacity-80"
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
                <div className="w-full">
                  <div className="flex flex-col h-full mx-auto bg-white shadow-xl quickview-screen">
                    <div className="flex-1 px-0">
                      <div className="relative py-0 mt-2 sm:px-0">
                        <button
                          type="button"
                          className="absolute top-0 right-0 lg:-top-12 lg:-right-10 p-0.5 z-10 rounded-full dark:text-black"
                          onClick={() => setModelClose()}
                        >
                          <span className="sr-only">{translate('common.label.closePanelText')}</span>
                          <XMarkIcon className="w-8 h-8" aria-hidden="true" />
                        </button>
                        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-12">
                          {isMobile ? <div className='flex flex-col justify-center w-full pb-10 text-center ipad-display-none'>
                            <h4 className='font-bold text-black font-24'>{translate('label.product.quickShopText')}</h4>
                          </div> :
                            <div className="sm:col-span-6 md:col-span-6 lg:col-span-6">
                              <div className="flex flex-col px-0 sm:px-0 sm:pb-0">
                                <Tab.Group
                                  as="div"
                                  className="sticky flex flex-col-reverse top-24 lg:col-span-7 min-mobile-pdp"
                                  title="product images"
                                >
                                  <Tab.List
                                    className={
                                      quickViewData?.images?.length > 1
                                        ? 'grid grid-cols-1 gap-10 sm:grid-cols-1 product-image product-image-border quickview'
                                        : 'grid grid-cols-1 gap-10 sm:grid-cols-1 product-image product-image-border quickview'
                                    }
                                  >
                                    <ImageGallery
                                      thumbnailAlt={quickViewData?.name}
                                      thumbnailTitle={quickViewData?.name}
                                      originalAlt={quickViewData?.name}
                                      items={images ?? []}
                                      thumbnailPosition="bottom"
                                      showPlayButton={false}
                                      showBullets={false}
                                      showNav={true}
                                      additionalClass="app-image-gallery"
                                      showFullscreenButton={false}
                                      renderItem={customRenderItem}
                                      renderThumbInner={customRenderThumbInner}
                                    />
                                  </Tab.List>
                                </Tab.Group>
                              </div>
                            </div>
                          }
                          <div className="max-quick-panel sm:col-span-6 md:col-span-6 lg:col-span-6 ipad-col-12">
                            <div className='grid grid-cols-12 gap-4 sm:grid-cols-1 sm:gap-0'>
                              {isMobile ? (
                                <div className='flex items-start col-span-5 sm:col-span-1'>
                                  <img
                                    src={generateUri(quickViewData?.image, 'h=200&fm=webp') || IMG_PLACEHOLDER}
                                    className="border border-gray-400 rounded"
                                    width={200}
                                    height={200}
                                    alt={productData?.title?.raw || "product"}
                                  />
                                </div>
                              ) : null}

                              <div className='col-span-7 sm:col-span-1'>
                                <div className="flex flex-col px-0 my-1 sm:px-0">
                                  <div className="font-semibold text-black uppercase font-18">
                                    {quickViewData?.name}{' '}
                                  </div>
                                </div>
                                {quickViewData?.promotions?.length > 0 && (
                                  <div className="flex w-auto gap-1 px-2 py-1 text-xs font-semibold text-black rounded-md bg-tan">
                                    <i className="sprite-star-black sprite-icons" />
                                    {quickViewData?.promotions?.map(
                                      (promo: any, promoIdx: number) => {
                                        return (
                                          <span key={`promo-${promoIdx}`}>
                                            {promo?.promoCode}
                                          </span>
                                        )
                                      }
                                    )}
                                  </div>
                                )}
                                <div className="flex flex-col px-0 mt-1 sm:px-0">
                                  <p className="font-bold text-black font-18">
                                    {isIncludeVAT
                                      ? quickViewData?.price?.formatted?.withTax
                                      : quickViewData?.price?.formatted?.withoutTax}
                                    {/* {selectedAttrData?.listPrice?.raw.tax > 0 ? ( */}
                                    <>
                                      <span className="px-2 font-light text-gray-400 line-through">
                                        {isIncludeVAT
                                          ? quickViewData?.listPrice?.formatted?.withTax
                                          : quickViewData?.listPrice?.formatted?.withoutTax}
                                      </span>
                                      {/* {discount > 0 && (
                                        <span className="font-medium text-red-500">
                                          {discount}% off
                                        </span>
                                      )} */}
                                      <span className='pl-1 font-light text-right text-gray-400 font-12'>{isIncludeVAT ? 'inc. VAT' : 'ex. VAT'}</span>
                                    </>
                                    {/* ) : null} */}
                                  </p>
                                </div>
                                <div className="flex flex-col px-0 pb-0 mb-4 sm:py-4 sm:pb-6 sm:border-b-2 sm:border-gray-200 sm:px-0">
                                  {isMobile ?
                                    <Link
                                      href={`/${quickViewData?.link}`}
                                      passHref
                                      legacyBehavior
                                    >
                                      <a className="text-sm font-semibold text-black underline">
                                       {translate('label.product.viewProductText')}
                                      </a>
                                    </Link> :
                                    <>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: quickViewData?.shortDescription,
                                        }}
                                        className="text-sm text-gray-500 product-info"
                                      />
                                      <Link
                                        href={`/${quickViewData?.link}`}
                                        passHref
                                        legacyBehavior
                                      >
                                        <a className="text-sm font-semibold text-black underline">
                                        {translate('label.product.viewMoreText')}
                                        </a>
                                      </Link>
                                    </>
                                  }

                                </div>
                              </div>
                            </div>

                            {updatedProduct ? (
                              <div className="flex flex-col px-0 sm:px-0">
                                <AttributesHandler
                                  product={productData}
                                  variant={selectedAttrData}
                                  setSelectedAttrData={setSelectedAttrData}
                                  variantInfo={variantInfo}
                                  handleSetProductVariantInfo={
                                    handleSetProductVariantInfo
                                  }
                                  sizeInit={sizeInit}
                                  setSizeInit={setSizeInit}
                                />
                              </div>
                            ) : null}

                            {!isEngravingAvailable ? (
                              <div className="flex mt-6 sm:mt-0 !text-sm">
                                <button
                                  className="relative w-20 mr-4 rounded custom-select"
                                  onClick={(e: any) => {
                                    setQuantity(e.target.value)
                                  }}
                                >
                                  <select className="h-full py-3 px-2 w-full border-[1px] border-black rounded dark:bg-white dark:text-black">
                                    {Array.from(
                                      Array(MAX_ADD_TO_CART_LIMIT).keys()
                                    )
                                      .map((x) => ({ id: x + 1, value: x + 1 }))
                                      .map((quant: any) => (
                                        <option
                                          value={quant.value}
                                          key={quant.id}
                                        >
                                          {quant.value}
                                        </option>
                                      ))}
                                  </select>
                                </button>
                                {(product?.currentStock < 1 && !product?.preOrder?.isEnabled && (!product?.flags?.sellWithoutInventory || !selectedAttrData?.sellWithoutInventory)
                                ) ? (
                                  <ButtonNotifyMe product={product} />
                                ) : <Button
                                  title={buttonConfig.title}
                                  action={buttonConfig.action}
                                  validateAction={buttonConfig.validateAction}
                                  type="button"
                                  buttonType={buttonConfig.buttonType || 'cart'}
                                />}
                              </div>
                            ) : (
                              <>
                                <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                  {(product?.currentStock < 1 && !product?.preOrder?.isEnabled && (!product?.flags?.sellWithoutInventory || !selectedAttrData?.sellWithoutInventory)
                                  ) ? (
                                    <ButtonNotifyMe product={product} className="block py-3 sm:hidden" />
                                  ) : <Button
                                    className="block py-3 sm:hidden"
                                    title={buttonConfig.title}
                                    action={buttonConfig.action}
                                    validateAction={buttonConfig.validateAction}
                                    buttonType={buttonConfig.type || 'cart'}
                                  />}
                                </div>
                                <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                                  {(product?.currentStock < 1 && !product?.preOrder?.isEnabled && (!product?.flags?.sellWithoutInventory || !selectedAttrData?.sellWithoutInventory)
                                  ) ? (
                                    <ButtonNotifyMe product={product} className="hidden sm:block" />
                                  ) : <Button
                                    className="hidden sm:block "
                                    title={buttonConfig.title}
                                    action={buttonConfig.action}
                                    validateAction={buttonConfig.validateAction}
                                    buttonType={buttonConfig.type || 'cart'}
                                  />}
                                  <button
                                    className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white uppercase bg-gray-400 border border-transparent rounded-sm sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                                    onClick={() => showEngravingModal(true)}
                                  >
                                    <span className="font-bold">
                                      {GENERAL_ENGRAVING}
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
                                      <HeartIcon className="flex-shrink-0 w-5 h-5 text-red-600" />
                                    ) : (
                                      <HeartIcon className="flex-shrink-0 w-5 h-5" />
                                    )}
                                    <span className="sr-only">
                                      {BTN_ADD_TO_FAVORITES}
                                    </span>
                                  </button>
                                </div>
                              </>
                            )}
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
