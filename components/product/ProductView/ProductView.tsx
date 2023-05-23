import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useEffect, Fragment, useCallback } from 'react'
import { Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import cartHandler from '@components/services/cart'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusSmallIcon, MinusSmallIcon } from '@heroicons/react/24/outline'
import {
  NEXT_CREATE_WISHLIST,
  NEXT_BULK_ADD_TO_CART,
  NEXT_UPDATE_CART_INFO,
  NEXT_GET_PRODUCT,
  NEXT_GET_PRODUCT_PREVIEW,
} from '@components/utils/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE,
  BTN_ADD_TO_FAVORITES,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  CLOSE_PANEL,
  GENERAL_ADD_TO_BASKET,
  GENERAL_ENGRAVING,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_REFERENCE,
  GENERAL_REVIEWS,
  GENERAL_REVIEW_OUT_OF_FIVE,
  IMG_PLACEHOLDER,
  ITEM_TYPE_ADDON,
  ITEM_TYPE_ADDON_10,
  PRICEMATCH_ADDITIONAL_DETAILS,
  PRICEMATCH_BEST_PRICE,
  PRICEMATCH_SEEN_IT_CHEAPER,
  PRODUCT_AVAILABILITY,
  PRODUCT_INFORMATION,
  PRODUCT_IN_STOCK,
  PRODUCT_OUT_OF_STOCK,
  PRODUCT_PERSONALIZATION_TITLE,
  SLUG_TYPE_MANUFACTURER,
  YOUTUBE_VIDEO_PLAYER,
} from '@components/utils/textVariables'
import {
  ELEM_ATTR,
  PDP_ELEM_SELECTORS,
} from '@framework/content/use-content-snippet'
import { generateUri } from '@commerce/utils/uri-util'
import { round } from 'lodash'
import ImageZoom from 'react-image-zooom'
import { matchStrings } from '@framework/utils/parse-util'
import RelatedProductWithGroup from '../RelatedProducts/RelatedProductWithGroup'
import AvailableOffers from './AvailableOffers'
import ReviewInput from '../Reviews/ReviewInput'

//DYNAMIC COMPONENT LOAD IN PRODUCT DETAIL
const AttributesHandler = dynamic(() => import('./AttributesHandler'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const RelatedProducts = dynamic(
  () => import('@components/product/RelatedProducts')
)
const Bundles = dynamic(() => import('@components/product/Bundles'))
const Reviews = dynamic(() => import('@components/product/Reviews'))
const PriceMatch = dynamic(() => import('@components/product/PriceMatch'))
const Engraving = dynamic(() => import('@components/product/Engraving'))
const ProductDetails = dynamic(
  () => import('@components/product/ProductDetails')
)
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage } from '@framework/utils/app-util'

const PLACEMENTS_MAP: any = {
  Head: {
    element: 'head',
    position: 'beforeend',
  },
  PageContainerAfter: {
    element: '.page-container',
    position: 'afterend',
  },
  PageContainerBefore: {
    element: '.page-container',
    position: 'beforebegin',
  },
}

export default function ProductView({
  data = { images: [] },
  snippets = [],
  setEntities,
  recordEvent,
  slug,
  isPreview = false,
  relatedProducts,
  promotions,
  pdpLookbookProducts,
  pdpCachedImages,
  reviews
}: any) {
  const {
    openNotifyUser,
    addToWishlist,
    openWishlist,
    basketId,
    cartItems,
    setCartItems,
    user,
    openCart,
  } = useUI()

  const [updatedProduct, setUpdatedProduct] = useState<any>(null)
  const [isPriceMatchModalShown, showPriceMatchModal] = useState(false)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [previewImg, setPreviewImg] = useState<any>()
  const [reviewInput, setReviewInput] = useState(false)
  const [variantInfo, setVariantInfo] = useState<any>({
    variantColour: '',
    variantSize: '',
  })
  const [sizeInit, setSizeInit] = useState('');
  let currentPage = getCurrentPage()

  const product = updatedProduct || data

  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: product?.recordId,
    stockCode: product?.stockCode,
    ...product,
  })

  const { ProductViewed } = EVENTS_MAP.EVENT_TYPES
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
  const { Product } = EVENTS_MAP.ENTITY_TYPES
  const fetchProduct = async () => {
    const url = !isPreview ? NEXT_GET_PRODUCT : NEXT_GET_PRODUCT_PREVIEW
    const response: any = await axios.post(url, { slug: slug })
    //console.log(JSON.stringify(response?.data))
    if (response?.data?.product) {
      eventDispatcher(ProductViewed, {
        entity: JSON.stringify({
          id: response?.data?.product?.recordId,
          sku: response?.data?.product?.sku,
          name: response?.data?.product?.name,
          stockCode: response?.data?.product?.stockCode,
          img: response?.data?.product?.image,
        }),
        entityId: response?.data?.product?.recordId,
        entityName: response?.data?.product?.name,
        entityType: Product,
        eventType: ProductViewed,
        omniImg: response?.data?.product?.image,
      })
      setUpdatedProduct(response.data.product)
      setSelectedAttrData({
        productId: response?.data?.product?.recordId,
        stockCode: response?.data?.product?.stockCode,
        ...response?.data?.product,
      })
    }
  }

  useEffect(() => {
    fetchProduct()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    const { entityId, entityName, entityType, entity } = KEYS_MAP
    setReviewInput(true)
    recordEvent(EVENTS.ProductViewed)
    if (snippets) {
      snippets.forEach((snippet: any) => {
        const domElement = document.querySelector(
          PLACEMENTS_MAP[snippet.placement]?.element
        )
        if (domElement) {
          domElement.insertAdjacentHTML(
            PLACEMENTS_MAP[snippet.placement].position,
            snippet.content
          )
        }
      })
    }
    //this function is triggered when the component is unmounted. here we clean the injected scripts
    return function cleanup() {
      snippets.forEach((snippet: any) => {
        document
          .getElementsByName(snippet.name)
          .forEach((node: any) => node.remove())
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNotification = () => {
    openNotifyUser(product?.recordId)
  }

  const productImages = product?.images || [];
  const productVideos = product?.videos || [];
  let content = [{ image: selectedAttrData.image }, ...productImages].filter(
    (value: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.image === value.image)
  )

  if (product?.videos && product?.videos?.length > 0) {
    content = [...productImages, ...productVideos].filter(
      (value: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.image === value.image)
    )
  }

  const [isPersonalizeLoading, setIsPersonalizeLoading] = useState(false)

  const handleTogglePersonalizationDialog = () => {
    if (!isPersonalizeLoading) showEngravingModal(v => !v)
  }

  const handleImgLoadT = (image: any) => {
    setPreviewImg(image)
  }

  const handlePreviewClose = () => {
    setPreviewImg(undefined)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId: basketId,
            productId: selectedAttrData.productId,
            qty: 1,
            manualUnitPrice: product?.price?.raw?.withTax,
            stockCode: selectedAttrData?.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product: selectedAttrData }
        )
        setCartItems(item)
        if (typeof window !== "undefined") {
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
                  index: 1,
                }
              ],
              cart_quantity: 1,
              total_value: product?.price?.raw?.withTax,
              current_page: "PDP",
              section_title: "Product Detail",
            }
          });
          if (currentPage) {
            recordGA4Event(window, 'view_cart', {
              ecommerce: {
                items: cartItems?.lineItems?.map((items: any, itemId: number) => (
                  {
                    item_name: items?.name,
                    item_id: items?.sku,
                    price: items?.price?.raw?.withTax,
                    item_brand: items?.brand,
                    item_category2: items?.categoryItems?.length ? items?.categoryItems[1]?.categoryName : "",
                    item_variant: items?.colorName,
                    item_list_name: items?.categoryItems?.length ? items?.categoryItems[0]?.categoryName : "",
                    item_list_id: "",
                    index: itemId,
                    quantity: items?.qty,
                    item_var_id: items?.stockCode,
                  }
                )),
                // device: deviceCheck,
                current_page: currentPage
              }
            });
          }
        }
      },
      shortMessage: '',
    }
    if (selectedAttrData?.currentStock <= 0 && !product?.preOrder?.isEnabled) {
      if (
        !product?.flags?.sellWithoutInventory ||
        !selectedAttrData?.sellWithoutInventory
      ) {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
      }
    } else if (
      product?.preOrder?.isEnabled &&
      selectedAttrData?.currentStock <= 0
    ) {
      if (
        product?.preOrder?.currentStock < product?.preOrder?.maxStock &&
        (!product?.flags?.sellWithoutInventory ||
          selectedAttrData?.sellWithoutInventory)
      ) {
        buttonConfig.title = BTN_PRE_ORDER
        buttonConfig.shortMessage = product?.preOrder?.shortMessage
        return buttonConfig
      } else if (
        product?.flags?.sellWithoutInventory ||
        selectedAttrData?.sellWithoutInventory
      ) {
        buttonConfig = {
          title: GENERAL_ADD_TO_BASKET,
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: selectedAttrData?.productId,
                qty: 1,
                manualUnitPrice: product?.price?.raw?.withTax,
                stockCode: selectedAttrData?.stockCode,
                userId: user.userId,
                isAssociated: user.isAssociated,
              },
              'ADD',
              { product: selectedAttrData }
            )
            setCartItems(item)
            if (typeof window !== "undefined") {
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
                      index: 1,
                    }
                  ],
                  cart_quantity: 1,
                  total_value: product?.price?.raw?.withTax,
                  current_page: "PDP",
                  section_title: "Product Detail",
                }
              });
              if (currentPage) {
                recordGA4Event(window, 'view_cart', {
                  ecommerce: {
                    items: cartItems?.lineItems?.map((items: any, itemId: number) => (
                      {
                        item_name: items?.name,
                        item_id: items?.sku,
                        price: items?.price?.raw?.withTax,
                        item_brand: items?.brand,
                        item_category2: items?.categoryItems?.length ? items?.categoryItems[1]?.categoryName : "",
                        item_variant: items?.colorName,
                        item_list_name: items?.categoryItems?.length ? items?.categoryItems[0]?.categoryName : "",
                        item_list_id: "",
                        index: itemId,
                        quantity: items?.qty,
                        item_var_id: items?.stockCode,
                      }
                    )),
                    // device: deviceCheck,
                    current_page: currentPage
                  }
                });
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

  const handleEngravingSubmit = (values: any) => {
    const updatedProduct = {
      ...product,
      ...{
        recordId: selectedAttrData.productId,
        stockCode: selectedAttrData.stockCode,
      },
    }
    const addonProducts = relatedProducts?.relatedProducts?.filter(
      (item: any) => item.itemType === ITEM_TYPE_ADDON_10
    )
    const addonProductsWithParentProduct = addonProducts?.map((item: any) => {
      item.parentProductId = updatedProduct?.recordId
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
        CustomInfo1: values.line1.message || null,
        CustomInfo2: values.line1.imageUrl || null,
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
        PriceMatchReqId: obj.priceMatchReqId || '00000000-0000-0000-0000-000000000000',
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
        openCart()
      } catch (error) {
        console.log(error, 'err')
      }
    }
    asyncHandler()
  }

  const isEngravingAvailable = !!relatedProducts?.relatedProducts?.filter((item: any) => item.stockCode === ITEM_TYPE_ADDON).length || !!product?.customAttributes.filter((item:any) => item.display == "Is Enabled" ).length
  // const isEngravingAvailable:any = true;
  
  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = () => {
    let productAvailability = "Yes"
    if (product?.currentStock > 0) {
      productAvailability = "Yes"
    }
    else {
      productAvailability = "No"
    }

    if (typeof window !== "undefined") {
      recordGA4Event(window, 'wishlist', {
        ecommerce: {
          header: product?.name,
          current_page: 'PDP',
        },
      })

      recordGA4Event(window, 'add_to_wishlist', {
        ecommerce: {
          items: [
            {
              item_name: product?.name,
              item_brand: product?.brand,
              item_category: product?.mappedCategories[0]?.categoryName,
              item_category2: product?.mappedCategories[1]?.categoryName,
              item_variant: product?.variantGroupCode,
              quantity: 1,
              item_id: product?.productCode,
              price: product?.price?.raw?.withTax,
            }
          ],
          item_var_id: product?.stockCode,
          header: "PDP",
          current_page: "PDP",
          availability: productAvailability,
        }
      });
    }

    if (currentPage) {
      if (typeof window !== "undefined") {
        recordGA4Event(window, 'wishlist', {
          ecommerce: {
            header: "PDP",
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
            productId: product?.recordId,
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

  const filteredRelatedProducts = relatedProducts?.relatedProducts?.filter(
    (item: any) => item.stockCode !== ITEM_TYPE_ADDON
  )


  const handleProductBundleUpdate = (bundledProduct: any) => {
    if (bundledProduct && bundledProduct?.id) {
      let clonedProduct = Object.assign({}, updatedProduct)
      if (clonedProduct && clonedProduct?.componentProducts) {
        setUpdatedProduct(clonedProduct)
      }
    }
  }

  const breadcrumbs = product?.breadCrumbs?.filter(
    (item: any) => item.slugType !== SLUG_TYPE_MANUFACTURER
  )
  SwiperCore.use([Navigation])
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  const addonPrice = relatedProducts?.relatedProducts?.find((x: any) => x?.itemType == 10)?.price?.formatted?.withTax;

  const css = { maxWidth: '100%', height: 'auto' }

  if (!product) {
    return null
  }

  return (
    <div className="mx-auto bg-white page-container md:w-full">
      <div className="px-4 pt-2 mx-auto sm:pt-6 sm:px-0 md:w-4/5">
        {breadcrumbs && (
          <BreadCrumbs items={breadcrumbs} currentProduct={product} />
        )}
      </div>
      <main className="sm:pt-8">
        <div className="lg:max-w-none">
          <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start lg:max-w-none md:w-4/5">
            <Tab.Group as="div" className="flex flex-col-reverse lg:col-span-7 min-mobile-pdp">
              <div className="grid grid-cols-1 sm:grid-cols-12 sm:gap-x-8">
                <div className="col-span-12 px-4 sm:px-0">
                  <div className="block w-full pt-6 mx-auto sm:hidden sm:pt-0">
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={4}
                      navigation={true}
                      loop={true}
                      breakpoints={{
                        640: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 4,
                        },
                        1024: {
                          slidesPerView: 4,
                        },
                      }}
                    >
                      <div role="list" className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0">
                        {content?.map((image: any, idx) => (
                          <SwiperSlide className="px-0" key={`${idx}-slider`}>
                            <div key={idx} className="inline-flex flex-col w-full text-center cursor-pointer lg:w-auto">
                              <div className="relative group">
                                {image.image ? (
                                  <div className="image-container">
                                    <Image
                                      priority
                                      src={generateUri(image.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER}
                                      alt={image.name}
                                      className="object-cover object-center w-full h-full image"
                                      // style={css}
                                      sizes="320 600 1000"
                                      quality="100"
                                      width={600}
                                      height={1000}
                                      blurDataURL={`${image.image}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER}
                                    />
                                  </div>
                                ) : (
                                  <PlayIcon className="object-cover object-center w-full h-full" />
                                )}
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </div>
                    </Swiper>
                  </div>
                  {/*DESKTOP PRODUCT IMAGE SLIDER*/}
                  <div className="hidden w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                    <Tab.List className={content?.length > 1 ? "grid grid-cols-1 gap-2 sm:grid-cols-2" : "grid grid-cols-1 gap-2 sm:grid-cols-1"}>
                      {content?.map((image: any, idx) => (
                        <Tab key={`${idx}-tab`}>
                          {() => (
                            <>
                              <span className="sr-only">{image.name}</span>
                              <span className="relative">
                                {image.image ? (
                                  <div className="image-container">
                                    <Image
                                      priority
                                      src={
                                        generateUri(
                                          image.image,
                                          'h=700&fm=webp'
                                        ) || IMG_PLACEHOLDER
                                      }
                                      alt={image.name}
                                      className="o`bject-cover object-center w-full h-full image"
                                      // style={css}
                                      sizes="320 600 1000"
                                      width={600}
                                      height={1000}
                                      onClick={(ev: any) =>
                                        handleImgLoadT(image.image)
                                      }
                                      blurDataURL={
                                        `${image.image}?h=600&w=400&fm=webp` ||
                                        IMG_PLACEHOLDER
                                      }
                                    />
                                    {/* </ControlledZoom> */}
                                  </div>
                                ) : (
                                  <PlayIcon className="object-cover object-center w-full h-full" />
                                )}
                              </span>
                            </>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                </div>
              </div>
            </Tab.Group>

            {/* Product info */}
            <div className="px-4 mt-2 sm:mt-10 sm:px-0 lg:mt-0 lg:col-span-5">
              <div className='flex justify-between gap-4'>
                <h3 className="mb-0 text-sm font-semibold tracking-tight text-gray-700 uppercase sm:text-md sm:font-bold">
                  {selectedAttrData.brand}
                </h3>

                <div>
                  <h3 className="sr-only">{GENERAL_REVIEWS}</h3>
                  <div className="flex items-center xs:flex-col">
                    <div className="flex items-center xs:text-center align-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(reviews?.review?.ratingAverage > rating ? 'text-yellow-400 h-3 w-3' : 'text-gray-300 h-4 w-4', 'flex-shrink-0')}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {reviews?.review?.productReviews?.length > 0 ?
                      <p className='pl-1 text-xs font-bold'>({reviews?.review?.ratingAverage})</p> : <p className='pl-1 text-xs font-bold'>(0)</p>
                    }
                  </div>
                </div>
              </div>

              <h1 className="text-lg font-medium tracking-tight text-black sm:text-2xl">
                {selectedAttrData.name || selectedAttrData.productName}
              </h1>
              <p className="mt-0 text-sm text-gray-400 uppercase sm:text-md sm:mt-1">
                <strong>{GENERAL_REFERENCE}:</strong>{' '}{selectedAttrData.stockCode}
              </p>
              <div className="mt-2">
                <h2 className="sr-only">{PRODUCT_INFORMATION}</h2>
                {updatedProduct ? (
                  <p className="text-2xl font-bold text-black sm:text-xl">
                    {selectedAttrData?.price?.formatted?.withTax}
                    {selectedAttrData?.listPrice?.raw.tax > 0 ? (
                      <>
                        <span className="px-2 font-normal text-gray-400 line-through font-xl">{product?.listPrice?.formatted?.withTax}</span>
                        <span className="font-semibold text-red-500 text-md">{discount}% off</span>
                      </>
                    ) : null}
                  </p>
                ) : (
                  <></>
                )}
              </div>


              <div className="w-full sm:w-full">
                <AttributesHandler
                  product={product}
                  variant={selectedAttrData}
                  setSelectedAttrData={setSelectedAttrData}
                  variantInfo={variantInfo}
                  handleSetProductVariantInfo={handleSetProductVariantInfo}
                  sizeInit={sizeInit}
                  setSizeInit={setSizeInit}
                />
              </div>
              <h4 className="my-4 text-sm font-bold tracking-tight text-black uppercase sm:font-semibold">
                {PRODUCT_AVAILABILITY}:{' '}
                {product?.currentStock > 0 ? (
                  <span>{PRODUCT_IN_STOCK}</span>
                ) : (
                  <span className="text-red-500">{PRODUCT_OUT_OF_STOCK}</span>
                )}
              </h4>
              {promotions?.promotions?.availablePromotions?.length > 0 &&
                <div className="flex-1 order-4 w-full sm:order-3">
                  <AvailableOffers currency={product?.price} offers={promotions?.promotions} />
                </div>
              }
              {updatedProduct ? (
                <>
                  {!isEngravingAvailable && (
                    <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                      <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                      <button type="button" onClick={() => { if (!isInWishList) { handleWishList() } }}
                        className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                      >
                        {isInWishList ? (<HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />) :
                          (<HeartIcon className="flex-shrink-0 w-6 h-6" />)
                        }
                        <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                      </button>
                    </div>
                  )}

                  {isEngravingAvailable && (
                    <>
                      <div className='flex w-auto hover:opacity-80' onClick={() => showEngravingModal(true)}>
                        <div className='mt-3'>
                          {/* <img
                              src="/logo-cx-commerce.png"
                              className="w-12 mb-1"
                            /> */}
                          <p className="text-sm underline cursor-pointer text-pink">
                            {PRODUCT_PERSONALIZATION_TITLE}
                          </p>
                        </div>
                        <div className='flex justify-center px-2 mt-3 cursor-pointer'>
                          {/* <PlusIcon className='w-3.5 h-4 md:my-1' />&nbsp;<p className='text-sm -ml-1 text-[#37B679] '>£5</p> */}
                        </div>
                      </div>

                      {/* <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                        <Button className="block py-3 sm:hidden" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                      </div> */}
                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                        <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                        {/* <button className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white uppercase bg-gray-400 border border-transparent rounded-sm sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                          onClick={() => showEngravingModal(true)}
                        >
                          <span className="font-bold">{GENERAL_ENGRAVING}</span>
                        </button> */}
                        <button type="button" onClick={() => { if (!isInWishList) { handleWishList() } }}
                          className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink">
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

              <section aria-labelledby="details-heading" className="mt-4 sm:mt-6">
                <h2 id="details-heading" className="sr-only">{PRICEMATCH_ADDITIONAL_DETAILS}</h2>
                <ProductDetails product={product} description={product?.description || product?.shortDescription} />
                <div className="mt-6 sm:mt-10">
                  <p className="text-lg text-gray-900">{selectedAttrData?.currentStock > 0 ? product?.deliveryMessage : product?.stockAvailabilityMessage}</p>
                </div>
              </section>
            </div>
          </div>

          {product?.componentProducts && (
            <Bundles price={product?.price?.formatted?.withTax} products={product?.componentProducts} productBundleUpdate={handleProductBundleUpdate} />
          )}

          {relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, "ALSOLIKE", true))?.length > 0 ? (
            <>
              <div className="flex flex-col">
                <div className="section-devider"></div>
              </div>
              <div className="px-0 mx-auto sm:container page-container">
                <div className='flex flex-col justify-center pb-8 text-center sm:pb-10'>
                  <h3 className='text-3xl font-bold text-black '>You May Also Like</h3>
                </div>
                <RelatedProductWithGroup products={relatedProducts?.relatedProducts} productPerColumn={5} />
              </div>
            </>
          ) : null}

          <div className={`${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`}></div>
          {reviews?.review?.productReviews?.length > 0 &&
            <>
              <div className="flex flex-col">
                <div className="section-devider"></div>
              </div>
              <Reviews className="mx-auto md:w-4/5" data={reviews?.review} />
            </>
          }
          <div className="flex flex-col">
            <div className="section-devider"></div>
          </div>
          <div className='px-6 mx-auto sm:px-0 md:w-4/5'>
            {reviewInput && <ReviewInput productId={product?.recordId} />}
          </div>
          {isEngravingAvailable && (
            <Engraving
              show={isEngravingOpen}
              submitForm={handleEngravingSubmit}
              onClose={() => showEngravingModal(false)}
              handleToggleDialog={handleTogglePersonalizationDialog}
              product={product}
            />
          )}

          <PriceMatch
            show={isPriceMatchModalShown}
            onClose={showPriceMatchModal}
            productName={product?.name}
            productImage={product?.images?.length ? product?.images[0]?.image : null}
            productId={product?.id}
            stockCode={product?.stockCode}
            ourCost={product?.price?.raw?.withTax}
            rrp={product?.listPrice?.raw?.withTax}
            ourDeliveryCost={product?.price?.raw?.tax} //TBD
          />
        </div>
      </main>

      {previewImg ? (
        <Transition.Root show={previewImg != undefined} as={Fragment}>
          <Dialog as="div" className="relative mt-4 z-999 top-4" onClose={handlePreviewClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handlePreviewClose} />
            </Transition.Child>

            <div className="fixed top-0 left-0 w-full overflow-y-auto z-9999">
              <div className="flex items-end justify-center h-screen min-h-screen p-4 mx-auto text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="relative px-4 pt-5 pb-4 mx-auto overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-2/6 sm:p-2">
                    <div>
                      <div className="flex items-center">
                        <button type="button" className="absolute p-2 text-gray-400 hover:text-gray-500 right-2 top-2 z-99" onClick={handlePreviewClose}>
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XMarkIcon className="w-6 h-6 text-black" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-center">
                        {previewImg && (
                          <div key={previewImg.name + 'tab-panel'}>
                            <ImageZoom src={previewImg || IMG_PLACEHOLDER} alt={previewImg.name} blurDataURL={`${previewImg}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : (
        <></>
      )}
    </div>
  )
}
