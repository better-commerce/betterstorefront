// Base Imports
import { useState, useEffect } from 'react'
import axios from 'axios'

// Package Imports
import dynamic from 'next/dynamic'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import ImageGallery from 'react-image-gallery'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import SwiperCore, { Navigation, Pagination, Zoom } from 'swiper'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Script from 'next/script';

// Component Imports
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import cartHandler from '@components/services/cart'
import { Messages, NEXT_CREATE_WISHLIST, NEXT_BULK_ADD_TO_CART, NEXT_UPDATE_CART_INFO, NEXT_GET_PRODUCT, NEXT_GET_PRODUCT_PREVIEW, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_COMPARE_ATTRIBUTE, SITE_ORIGIN_URL } from '@components/utils/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'

// Other Imports
import { BTN_ADD_TO_FAVORITES, BTN_NOTIFY_ME, BTN_PRE_ORDER, GENERAL_ADD_TO_BASKET, GENERAL_REFERENCE, IMG_PLACEHOLDER, ITEM_TYPE_ADDON, ITEM_TYPE_ADDON_10, ITEM_TYPE_ALTERNATIVE, PRICEMATCH_ADDITIONAL_DETAILS, PRODUCT_AVAILABILITY, PRODUCT_INFORMATION, PRODUCT_IN_STOCK, PRODUCT_OUT_OF_STOCK, PRODUCT_PERSONALIZATION_TITLE, SLUG_TYPE_MANUFACTURER } from '@components/utils/textVariables'
import { ELEM_ATTR, PDP_ELEM_SELECTORS, } from '@framework/content/use-content-snippet'
import { generateUri } from '@commerce/utils/uri-util'
import _, { groupBy, round } from 'lodash'
import { matchStrings, stringFormat } from '@framework/utils/parse-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage, validateAddToCart, vatIncluded, } from '@framework/utils/app-util'
import DeliveryInfo from './DeliveryInfo'
import ProductSpecifications from '../ProductDetails/specifications'
import ProductDescription from './ProductDescription'
import CacheProductImages from './CacheProductImages'
import PDPCompare from '../PDPCompare'
import { LocalStorage } from '@components/utils/payment-constants'
import wishlistHandler from '@components/services/wishlist'
const Preview = dynamic(() => import('@components/product/ProductCard/Preview'))
const AttributesHandler = dynamic(() => import('@components/product/ProductView/AttributesHandler'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const Bundles = dynamic(() => import('@components/product/Bundles'))
const Reviews = dynamic(() => import('@components/product/Reviews'))
const PriceMatch = dynamic(() => import('@components/product/PriceMatch'))
const Engraving = dynamic(() => import('@components/product/Engraving'))
const ProductDetails = dynamic(() => import('@components/product/ProductDetails'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const RelatedProductWithGroup = dynamic(() => import('@components/product/RelatedProducts/RelatedProductWithGroup'))
const AvailableOffers = dynamic(() => import('@components/product/ProductView/AvailableOffers'))
const ReviewInput = dynamic(() => import('@components/product/Reviews/ReviewInput'))
const QuantityBreak = dynamic(() => import('@components/product/ProductView/QuantiyBreak'))
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

export default function ProductView({ data = { images: [] }, snippets = [], recordEvent, slug, isPreview = false, relatedProductsProp, promotions, pdpCachedImages: cachedImages, reviews, deviceInfo, config, maxBasketItemsCount, allProductsByCategory: allProductsByCategoryProp, }: any) {
  const { isMobile } = deviceInfo
  const { openNotifyUser, addToWishlist, openWishlist, basketId, cartItems, setAlert, setCartItems, user, openCart, openLoginSideBar, isGuestUser, setIsCompared, removeFromWishlist, currency, } = useUI()
  const {isInWishList,deleteWishlistItem} = wishlistHandler()
  const isIncludeVAT = vatIncluded()
  const [product, setUpdatedProduct] = useState<any>(data)
  const [isPriceMatchModalShown, showPriceMatchModal] = useState(false)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [previewImg, setPreviewImg] = useState<any>()
  const [reviewInput, setReviewInput] = useState(false)
  const [variantInfo, setVariantInfo] = useState<any>({ variantColour: '', variantSize: '', })
  const [isLoading, setIsLoading] = useState(true)
  const [sizeInit, setSizeInit] = useState('')
  const [isPersonalizeLoading, setIsPersonalizeLoading] = useState(false)
  const [fullscreen, setFullscreen] = useState(false);
  const [attributeNames, setAttributeNames] = useState([])
  const [allProductsByCategory, setAllProductsByCategory] = useState<any>(allProductsByCategoryProp)
  const [relatedProducts, setRelatedProducts] = useState<any>(relatedProductsProp)
  const [compareProductsAttributes, setCompareProductAttribute] = useState([])
  let currentPage = getCurrentPage()
  const alternativeProducts = relatedProducts?.relatedProducts?.filter((item: any) => item.relatedType == ITEM_TYPE_ALTERNATIVE)
  useEffect(() => {
    if (compareProductsAttributes?.length < 0) return
    let mappedAttribsArrStr: any = compareProductsAttributes?.map((o: any) => o?.customAttributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr?.map((o: any) => o?.fieldName))
    setAttributeNames(mappedAttribsArrStr)
  }, [compareProductsAttributes])

  const fetchRelatedProducts = async (productId: string) => {
    const { data: relatedProducts }: any = await axios.post(NEXT_GET_ORDER_RELATED_PRODUCTS, { recordId: productId, })
    setRelatedProducts(relatedProducts)
    const alternativeProducts = relatedProducts?.relatedProducts?.filter((item: any) => item?.relatedType == ITEM_TYPE_ALTERNATIVE)
    const stockCodeArray = alternativeProducts?.map((item: { stockCode: any }) => item?.stockCode);
    const newArray = stockCodeArray?.concat(product?.stockCode);

    if (alternativeProducts?.length > 0) {
      const { data: compareDataResult }: any = await axios.post(NEXT_COMPARE_ATTRIBUTE, { stockCodes: newArray || [], compareAtPDP: true })
      setCompareProductAttribute(compareDataResult)
    }
  }
  const [selectedAttrData, setSelectedAttrData] = useState({ productId: product?.recordId, stockCode: product?.stockCode, ...product, })
  useEffect(() => {
    if (allProductsByCategory?.length < 0) return
    let mappedAttribsArrStr = allProductsByCategory?.map((o: any) => o.attributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr?.map((o: any) => o.display))
    setAttributeNames(mappedAttribsArrStr)
  }, [allProductsByCategory])

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
    if (response?.data?.product) {
      fetchRelatedProducts(response?.data?.product?.recordId)
      const recentlyViewedProduct: any = response?.data?.product?.stockCode;
      let viewedProductsList = []
      viewedProductsList = localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED) ? JSON.parse(decrypt(localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED) || '[]')) : []
      if (viewedProductsList?.length == 0) {
        viewedProductsList?.push(recentlyViewedProduct)
      } else {
        const checkDuplicate: any = viewedProductsList?.some((val: any) => val === recentlyViewedProduct)
        if (!checkDuplicate) {
          viewedProductsList.push(recentlyViewedProduct)
        }
      }
      localStorage.setItem(
        LocalStorage.Key.RECENTLY_VIEWED,
        encrypt(JSON.stringify(viewedProductsList))
      )
    }
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
    setIsCompared('true')
  }, [slug, currency])

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

  const productImages = product?.images || []
  const productVideos = product?.videos || []
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

  const handleTogglePersonalizationDialog = () => {
    if (!isPersonalizeLoading) showEngravingModal((v) => !v)
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
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === selectedAttrData?.productId?.toUpperCase())
        if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier &&  !selectedAttrData?.flags?.sellWithoutInventory) {
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
            msg: stringFormat(Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'], {
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
            productId: selectedAttrData?.productId,
            qty: 1,
            manualUnitPrice: product?.price?.raw?.withTax,
            stockCode: selectedAttrData?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
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
                  index: 1,
                },
              ],
              cart_quantity: 1,
              total_value: product?.price?.raw?.withTax,
              current_page: 'PDP',
              section_title: 'Product Detail',
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
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === selectedAttrData?.productId?.toUpperCase())
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
                productId: selectedAttrData?.productId,
                qty: 1,
                manualUnitPrice: product?.price?.raw?.withTax,
                stockCode: selectedAttrData?.stockCode,
                userId: user?.userId,
                isAssociated: user?.isAssociated,
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
                      index: 1,
                    },
                  ],
                  cart_quantity: 1,
                  total_value: product?.price?.raw?.withTax,
                  current_page: 'PDP',
                  section_title: 'Product Detail',
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
                        item_category2: items?.categoryItems?.length ? items?.categoryItems[1]?.categoryName : '',
                        item_variant: items?.colorName,
                        item_list_name: items?.categoryItems?.length ? items?.categoryItems[0]?.categoryName : '',
                        item_list_id: '',
                        index: itemId,
                        quantity: items?.qty,
                        item_var_id: items?.stockCode,
                      })
                    ),
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

  const handleEngravingSubmit = (values: any) => {
    const updatedProduct = {
      ...product,
      ...{
        recordId: selectedAttrData?.productId,
        stockCode: selectedAttrData?.stockCode,
      },
    }
    const addonProducts = relatedProducts?.relatedProducts?.filter((item: any) => item?.itemType === ITEM_TYPE_ADDON_10)
    const addonProductsWithParentProduct = addonProducts?.map((item: any) => {
      item.parentProductId = updatedProduct?.recordId
      return item
    })
    const computedProducts = [
      ...addonProductsWithParentProduct,
      updatedProduct,
    ].reduce((acc: any, obj: any) => {
      acc.push({
        ProductId: obj?.recordId || obj?.productId,
        BasketId: basketId,
        ParentProductId: obj?.parentProductId || null,
        Qty: 1,
        DisplayOrder: obj?.displayOrder || 0,
        StockCode: obj?.stockCode,
        ItemType: obj?.itemType || 0,
        CustomInfo1: values?.line1?.message || null,
        CustomInfo2: values?.line1?.imageUrl || null,
        CustomInfo3: values?.line3 || null,
        CustomInfo4: values?.line4 || null,
        CustomInfo5: values?.line5 || null,
        ProductName: obj?.name,
        ManualUnitPrice: obj?.manualUnitPrice || 0.0,
        PostCode: obj?.postCode || null,
        IsSubscription: obj?.subscriptionEnabled || false,
        IsMembership: obj?.hasMembership || false,
        SubscriptionPlanId: obj?.subscriptionPlanId || null,
        SubscriptionTermId: obj?.subscriptionTermId || null,
        UserSubscriptionPricing: obj?.userSubscriptionPricing || 0,
        GiftWrapId: obj?.giftWrapConfig || null,
        IsGiftWrapApplied: obj?.isGiftWrapApplied || false,
        ItemGroupId: obj?.itemGroupId || 0,
        PriceMatchReqId:
          obj?.priceMatchReqId || '00000000-0000-0000-0000-000000000000',
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

  const isEngravingAvailable =
    !!relatedProducts?.relatedProducts?.filter(
      (item: any) => item?.stockCode === ITEM_TYPE_ADDON
    ).length ||
    !!product?.customAttributes.filter(
      (item: any) => item?.display == 'Is Enabled'
    ).length
  // const isEngravingAvailable:any = true;

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    openWishlist()
  }
  const handleWishList = () => {
    if (isInWishList(product?.recordId)) {
      deleteWishlistItem(user?.userId, product?.recordId)
      removeFromWishlist(product?.recordId)
      openWishlist()
      return
    }
    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }

    if (typeof window !== 'undefined') {
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
            },
          ],
          item_var_id: product?.stockCode,
          header: 'PDP',
          current_page: 'PDP',
          availability: productAvailability,
        },
      })
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'wishlist', {
          ecommerce: {
            header: 'PDP',
            current_page: currentPage,
          },
        })
      }
    }

    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      //  setAlert({ type: 'success', msg:" Please Login "})
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user?.userId,
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
  const filteredRelatedProducts = relatedProducts?.relatedProducts?.filter((item: any) => item.stockCode !== ITEM_TYPE_ADDON)
  const handleProductBundleUpdate = (bundledProduct: any) => {
    if (bundledProduct && bundledProduct?.id) {
      let clonedProduct = Object.assign({}, product)
      if (clonedProduct && clonedProduct?.componentProducts) {
        setUpdatedProduct(clonedProduct)
      }
    }
  }

  const breadcrumbs = product?.breadCrumbs?.filter((item: any) => item.slugType !== SLUG_TYPE_MANUFACTURER)
  SwiperCore.use([Navigation])
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  const addonPrice = relatedProducts?.relatedProducts?.find((x: any) => x?.itemType == 10)?.price?.formatted?.withTax
  const css = { maxWidth: '100%', height: 'auto' }
  const attrGroup = groupBy(product?.customAttributes, 'key')

  if (!product) {
    return null
  }

  const images = content.map((image: any) => {
    return {
      original: image.image,
      thumbnail: image.image,
    }
  })

  const bundleAddToCart = async () => {
    const item = await cartHandler().addToCart(
      {
        basketId,
        productId: product?.recordId ?? product?.productId,
        qty: 1,
        manualUnitPrice: product?.price?.raw?.withTax,
        stockCode: product?.stockCode,
        userId: user?.userId,
        isAssociated: user?.isAssociated,
      },
      'ADD',
      { product }
    )
    setCartItems(item)
    openCart()
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const renderCustomControls = () => {
    if (fullscreen) {
      return (
        <button className='absolute items-center justify-center rounded flex-end icon-container right-5 z-999 ' onClick={exitFullscreen}>
          <XMarkIcon className="w-8 h-8 mt-3 text-white border-2 rounded-sm hover:text-orange-500 hover:border-orange-500" aria-hidden="true" />
        </button>
      );
    }
    return
  };

  const exitFullscreen = () => {
    if (document) document?.exitFullscreen();
    return
  };

  const customRenderItem = (item: any) => {
    return (
      <div className="flex justify-center image-gallery-image">
        <img src={generateUri(item?.original, "h=2000&fm=webp") || IMG_PLACEHOLDER} alt={product?.name} height={1000} width={1000} className="!object-contain" />
      </div>
    );
  };
  const customRenderThumbInner = (item: any) => {
    return (
      <img src={generateUri(item?.thumbnail, "h=150&fm=webp") || IMG_PLACEHOLDER} alt={product?.name || 'product'} height={150} width={100} />
    );
  };

  return (
    <>
      <CacheProductImages data={cachedImages} setIsLoading={setIsLoading} />
      <div className="w-full pt-6 mx-auto lg:max-w-none sm:pt-8">
        <div className="px-4 mx-auto mb-4 2xl:w-4/5 sm:px-6 md:px-4 lg:px-6 2xl:px-0 sm:mb-6">
          {breadcrumbs && (
            <BreadCrumbs items={breadcrumbs} currentProduct={product} />
          )}
        </div>
        <div className="mx-auto lg:grid lg:grid-cols-12 lg:items-start lg:max-w-none 2xl:w-4/5 sm:px-6 md:px-4 lg:px-6 2xl:px-0 mob-container-padding">
          {isMobile ? (
            <Swiper slidesPerView={1} spaceBetween={10} zoom={true} modules={[Pagination, Zoom]} pagination={{ clickable: true }} navigation={true} loop={true} className='lg:px-0 swiper-dot-black' breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 }, }} >
              {content?.map((image: any, idx) => (
                <SwiperSlide className="relative inline-flex flex-col w-full px-0 text-center cursor-pointer group lg:w-auto" key={`${idx}-slider`} >
                  {image.image ? (
                    <div className="image-container swiper-zoom-container">
                      <img src={generateUri(image?.image, 'h=600&fm=webp') || IMG_PLACEHOLDER} alt={product?.name || 'slider-image'} className="object-cover object-center w-full h-full image" sizes="320 600 1000" width={600} height={1000} />
                    </div>
                  ) : (
                    <img src={IMG_PLACEHOLDER} alt={product?.name || 'slider-image'} className="object-cover object-center w-full h-full image" sizes="320 600 1000" width={600} height={1000} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <>
              <Tab.Group as="div" className="sticky flex flex-col-reverse top-24 lg:col-span-7 min-mobile-pdp" title="product images" >
                <Tab.List className={content?.length > 1 ? 'grid grid-cols-1 gap-10 sm:grid-cols-1' : 'grid grid-cols-1 gap-10 sm:grid-cols-1'} >
                  <ImageGallery thumbnailAlt={product?.name} thumbnailTitle={product?.name} originalAlt={product?.name} items={images} thumbnailPosition="left" showPlayButton={false} showBullets={false} showNav={false} additionalClass={`app-image-gallery ${fullscreen ? 'fullscreen' : ''}`} showFullscreenButton={true} onScreenChange={toggleFullscreen} renderCustomControls={renderCustomControls} renderItem={customRenderItem} renderThumbInner={customRenderThumbInner} />
                </Tab.List>
              </Tab.Group>
            </>
          )}

          {/* Product info */}
          <div className="px-4 mt-2 sm:mt-10 sm:px-4 lg:mt-0 lg:col-span-5 mob-padding-container">
            <div className="flex justify-between gap-4 mb-3 sm:mb-0">
              <p className="mt-0 mb-0 text-sm font-semibold tracking-tight text-gray-700 uppercase sm:text-md sm:font-bold">
                {selectedAttrData.brand}
              </p>
              <div className="flex items-center xs:flex-col">
                <div className="flex items-center xs:text-center align-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon key={rating} aria-hidden="true" className={classNames(reviews?.review?.ratingAverage > rating ? 'text-yellow-400 h-3 w-3' : 'text-gray-300 h-4 w-4', 'flex-shrink-0')} />
                  ))}
                </div>
                {reviews?.review?.productReviews?.length > 0 ? (
                  <p className="pl-1 my-auto text-xs font-bold">
                    ({reviews?.review?.ratingAverage})
                  </p>
                ) : (
                  <p className="pl-1 my-auto text-xs font-bold dark:text-black">(0)</p>
                )}
              </div>
            </div>

            <h1 className="mb-3 font-medium tracking-tight text-black font-36 sm:mb-0">
              {selectedAttrData.name || selectedAttrData.productName}
            </h1>
            <p className="mt-0 text-sm text-black uppercase sm:text-xs sm:mt-1">
              <strong>{GENERAL_REFERENCE}:</strong> {selectedAttrData.stockCode}
            </p>
            <div className="my-4">
              <h2 className="sr-only">{PRODUCT_INFORMATION}</h2>
              {product && (
                <p className="text-2xl font-bold text-black sm:text-xl font-24">
                  {isIncludeVAT ? selectedAttrData?.price?.formatted?.withTax : selectedAttrData?.price?.formatted?.withoutTax}
                  {selectedAttrData?.listPrice?.raw.tax > 0 && (
                    <>
                      <span className="px-2 text-sm font-medium text-gray-900 line-through"> {isIncludeVAT ? product?.listPrice?.formatted?.withTax : product?.listPrice?.formatted?.withoutTax} </span>
                      <span className="text-sm font-medium text-red-500"> {discount}% off </span>
                    </>
                  )}
                </p>
              )}
            </div>
            {product?.quantityBreakRules?.length > 0 &&
              <QuantityBreak product={product} rules={product?.quantityBreakRules} selectedAttrData={selectedAttrData} />
            }
            <AttributesHandler product={product} variant={selectedAttrData} setSelectedAttrData={setSelectedAttrData} variantInfo={variantInfo} handleSetProductVariantInfo={handleSetProductVariantInfo} sizeInit={sizeInit} setSizeInit={setSizeInit} />

            <h4 className="h-5 my-4 text-sm font-bold tracking-tight text-black uppercase sm:font-semibold">
              {PRODUCT_AVAILABILITY}:{' '} {(product?.currentStock <= 0 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory) ? (
                <span>{PRODUCT_OUT_OF_STOCK}</span>
              ) : (
                <span className="text-red-500">{PRODUCT_IN_STOCK}</span>
              )}
            </h4>
            {promotions?.promotions?.availablePromotions?.length > 0 && (
              <AvailableOffers currency={product?.price} offers={promotions?.promotions} key={product?.id} />
            )}
            {product && (
              <>
                {isEngravingAvailable ? (
                  <>
                    <div className="flex w-auto mt-3 text-sm underline cursor-pointer hover:opacity-80 text-pink" onClick={() => showEngravingModal(true)} >
                      {PRODUCT_PERSONALIZATION_TITLE}
                    </div>
                    <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                      <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} validateAction={buttonConfig.validateAction} buttonType={buttonConfig.type || 'cart'} />
                      <button type="button" onClick={handleWishList} className="flex items-center justify-center ml-4 border border-gray-300 hover:bg-red-50 hover:text-pink btn hover:border-pink" >
                        {isInWishList(product?.recordId) ? (
                          <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                        ) : (
                          <HeartIcon className="flex-shrink-0 w-6 h-6" />
                        )}
                        <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                    <Button title={buttonConfig.title} action={buttonConfig.action} validateAction={buttonConfig.validateAction} buttonType={buttonConfig.type || 'cart'} />
                    <button type="button" onClick={handleWishList} className="flex items-center justify-center ml-4 border border-gray-300 hover:bg-red-50 hover:text-pink hover:border-pink btn" >
                      {isInWishList(product?.recordId) ? (
                        <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                      ) : (
                        <HeartIcon className="flex-shrink-0 w-6 h-6" />
                      )}
                      <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="flex-1 order-6 w-full sm:order-5">
              <DeliveryInfo product={product} grpData={attrGroup} config={config} />
            </div>
            <section aria-labelledby="details-heading" className="mt-4 sm:mt-6">
              <h2 id="details-heading" className="sr-only"> {PRICEMATCH_ADDITIONAL_DETAILS} </h2>
              <ProductDetails product={product} description={product?.description || product?.shortDescription} />
              <p className="mt-6 text-lg text-gray-900 sm:mt-10">
                {selectedAttrData?.currentStock > 0 ? product?.deliveryMessage : product?.stockAvailabilityMessage}
              </p>
            </section>
          </div>
        </div>
        <div className="flex flex-col section-devider"></div>
        <div className="flex flex-col w-full px-0 lg:mx-auto sm:container page-container">
          <ProductSpecifications attrGroup={attrGroup} product={product} deviceInfo={deviceInfo} />
        </div>

        {product?.componentProducts && (
          <>
            <div className="flex flex-col section-devider"></div>
            <Bundles price={isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax} products={product?.componentProducts} productBundleUpdate={handleProductBundleUpdate} deviceInfo={deviceInfo} onBundleAddToCart={bundleAddToCart} />
          </>
        )}
        {alternativeProducts?.length > 0 && (
          <div className="flex flex-col w-full px-0 pt-10 pb-6 mx-auto">
            <div className="flex flex-col section-devider"></div>
            <PDPCompare compareProductsAttributes={compareProductsAttributes} name={data?.brand || ''} pageConfig={config} products={alternativeProducts} deviceInfo={deviceInfo} activeProduct={product} maxBasketItemsCount={maxBasketItemsCount(config)} attributeNames={attributeNames} />
          </div>
        )}

        {relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, 'ALSOLIKE', true))?.length > 0 && (
          <>
            <div className="flex flex-col section-devider"></div>
            <div className="container flex flex-col w-full px-4 mx-auto page-container sm:px-4 lg:px-4 2xl:px-0 md:px-4">
              <h3 className="justify-center pb-8 text-3xl font-bold text-center text-black sm:pb-10"> You May Also Like </h3>
              <RelatedProductWithGroup products={relatedProducts?.relatedProducts} productPerColumn={5} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
            </div>
          </>
        )}

        <div className={`${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`}></div>
        {reviews?.review?.productReviews?.length > 0 && (
          <>
            <div className="flex flex-col section-devider" aria-hidden="true" ></div>
            <Reviews className="mx-auto md:w-4/5" data={reviews?.review} />
          </>
        )}
        <div className="flex flex-col section-devider " aria-hidden="true"></div>
        <div className="px-4 pb-5 mx-auto mb-5 sm:px-4 lg:container sm:pb-10 sm:mb-10 md:px-6 lg:px-6 2xl:px-0 ">
          {reviewInput && <ReviewInput productId={product?.recordId} />}
        </div>
        {isEngravingAvailable && (
          <Engraving show={isEngravingOpen} submitForm={handleEngravingSubmit} onClose={() => showEngravingModal(false)} handleToggleDialog={handleTogglePersonalizationDialog} product={product} />
        )}

        <PriceMatch show={isPriceMatchModalShown} onClose={showPriceMatchModal} productName={product?.name} productImage={product?.images?.length && product?.images[0]?.image} productId={product?.id} stockCode={product?.stockCode} ourCost={isIncludeVAT ? product?.price?.raw?.withTax : product?.price?.raw?.withoutTax} rrp={isIncludeVAT ? product?.listPrice?.raw?.withTax : product?.listPrice?.raw?.withoutTax} ourDeliveryCost={product?.price?.raw?.tax} />

        <div className="flex flex-col w-full">
          <div className="px-4 mx-auto sm:container page-container sm:px-6">
            <ProductDescription seoInfo={attrGroup} />
          </div>
        </div>

        {previewImg && <Preview previewImg={previewImg} handlePreviewClose={handlePreviewClose} />
        }
      </div>
    </>
  )
}
