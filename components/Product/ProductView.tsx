// React & Next.js
import { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'

// Third-party packages
import axios from 'axios'
import _, { groupBy } from 'lodash'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import ImageGallery from 'react-image-gallery'
import { Swiper, SwiperSlide } from 'swiper/react'

// Icons
import { GiftIcon, InformationCircleIcon, MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { DiscussionEmbed } from 'disqus-react';

// Styles
import 'swiper/swiper-bundle.min.css'

// Utilities
import { decrypt, encrypt } from '@framework/utils/cipher'
import { generateUri } from '@commerce/utils/uri-util'
import { matchStrings, stringFormat, roundToDecimalPlaces } from '@framework/utils/parse-util'
import { getCurrentPage, validateAddToCart, vatIncluded } from '@framework/utils/app-util'

// Constants
import { NEXT_CREATE_WISHLIST, NEXT_BULK_ADD_TO_CART, NEXT_UPDATE_CART_INFO, NEXT_GET_PRODUCT, NEXT_GET_PRODUCT_PREVIEW, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_COMPARE_ATTRIBUTE, EmptyString, EngageEventTypes, SITE_ORIGIN_URL, NEXT_GET_LOOKBOOK, NEXT_GET_LOOKBOOK_BY_SLUG, NEXT_CUSTOMER_PRODUCT_INTEREST } from '@components/utils/constants'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import { CUSTOM_EVENTS, EVENTS_MAP } from '@components/services/analytics/constants'
import { IMG_PLACEHOLDER, ITEM_TYPE_ADDONS, ITEM_TYPE_ADDON_10, ITEM_TYPE_ALTERNATIVE, SLUG_TYPE_MANUFACTURER } from '@components/utils/textVariables'
import { ELEM_ATTR, PDP_ELEM_SELECTORS } from '@framework/content/use-content-snippet'
import { LocalStorage } from '@components/utils/payment-constants'
import { PRODUCTS } from './data'

// Hooks & Context
import { useUI } from '@components/ui/context'
import { useTranslation } from '@commerce/utils/use-translation'
import useAnalytics from '@components/services/analytics/useAnalytics'

// Services
import cartHandler from '@components/services/cart'
import wishlistHandler from '@components/services/wishlist'

// Types
import { AnalyticsEventType } from '@components/services/analytics'
import ReviewInput from './Reviews/ReviewInput'
import { getItem } from '@components/utils/localStorage'
import { content } from 'tailwind.config'

// Dynamically imported components
const ProductDescription = dynamic(() => import('./ProductDescription'))
const CacheProductImages = dynamic(() => import('./CacheProductImages'))
const EngageProductCard = dynamic(() => import('@components/SectionEngagePanels/ProductCard'))
const ProductSocialProof = dynamic(() => import('./ProductSocialProof'))
const TechnicalSpecifications = dynamic(() => import('./TechnicalSpecification'))
const ButtonClose = dynamic(() => import('@components/shared/ButtonClose/ButtonClose'))
const TabProductCompare = dynamic(() => import('./TabProductCompare'))
const RichProductView = dynamic(() => import('./RichProductView'))
const DefaultProductView = dynamic(() => import('./DefaultProductView'))
const LookbookGrid = dynamic(() => import('@components/Product/Lookbook/LookbookGrid'))
const PDPCompare = dynamic(() => import('@components/Product/PDPCompare'))
const PDPDetails = dynamic(() => import('@components/Product/ProductDetails/productDetails'))
const ProductSpecification = dynamic(() => import('@components/Product/ProductDetails/specification'))
const ProductSpecifications = dynamic(() => import('@components/Product/Specifications'))
const ProductTag = dynamic(() => import('@components/Product/ProductTag'))
const ProductTabs = dynamic(() => import('@components/Product/ProductTabs'))
const TabProductCard = dynamic(() => import('@components/Product/TabProductCard'))
const ReviewItem = dynamic(() => import('@components/ReviewItem'))
const AttributesHandler = dynamic(() => import('@components/Product/AttributesHandler'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const Bundles = dynamic(() => import('@components/Product/Bundles'))
const Engraving = dynamic(() => import('@components/Product/Engraving'))
const RelatedProductWithGroup = dynamic(() => import('@components/Product/RelatedProducts/RelatedProductWithGroup'))
declare const window: any
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

export default function ProductView({ data = { images: [] }, snippets = [], recordEvent, slug, isPreview = false, relatedProductsProp, promotions, pdpCachedImages: cachedImages, reviews, deviceInfo, config, maxBasketItemsCount, allProductsByCategory: allProductsByCategoryProp, campaignData, featureToggle, defaultDisplayMembership, selectedFilters = [] }: any) {
  const { openNotifyUser, addToWishlist, openWishlist, basketId, cartItems, setAlert, setCartItems, user, openCart, openLoginSideBar, isGuestUser, setIsCompared, removeFromWishlist, currency, setProductInfo, closeSidebar } = useUI()
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
  let currentPage = getCurrentPage()
  const isIncludeVAT = vatIncluded()
  const { isMobile } = deviceInfo
  const { status } = PRODUCTS[0];
  const { isInWishList, deleteWishlistItem } = wishlistHandler()
  const [product, setUpdatedProduct] = useState<any>(data)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [variantInfo, setVariantInfo] = useState<any>({ variantColour: '', variantSize: '', })
  const [isLoading, setIsLoading] = useState(false)
  const [sizeInit, setSizeInit] = useState('')
  const [isPersonalizeLoading, setIsPersonalizeLoading] = useState(false)
  const [fullscreen, setFullscreen] = useState(false);
  const [attributeNames, setAttributeNames] = useState([])
  const [allProductsByCategory, setAllProductsByCategory] = useState<any>(allProductsByCategoryProp)
  const [relatedProducts, setRelatedProducts] = useState<any>(relatedProductsProp)
  const [compareProductsAttributes, setCompareProductAttribute] = useState([])
  const [isEngravingAvailable, setIsEngravingAvailable] = useState<any>(null)
  const [showMobileCaseButton, setShowMobileCaseButton] = useState(false);
  const [openStoreLocatorModal, setOpenStockCheckModal] = useState(false)
  const [showDetails, setShowGwpDetail] = useState(false)
  const [lookbookData, setLookbookData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [selectedOption, setSelectedOption] = useState("new");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitReview, setSubmitReview] = useState(false)
  const baseUrl = "https://parkcameras.bettercommerce.tech/"
  const alternativeProducts = relatedProducts?.relatedProducts?.filter((item: any) => item.relatedType == ITEM_TYPE_ALTERNATIVE)
  // CHECK TRENDING PRODUCTS FROM ENGAGE
  let similarProduct = []
  let recentProduct = []
  if (typeof window !== 'undefined') {
    similarProduct = window?.similar_products_sorted_product;
    recentProduct = window?.recent_products_product;
  }
  let productDesc = product.description
  if (product?.shortDescription == "") {
    productDesc = product.description
  }

  const detailsConfig = [
    { name: translate('common.label.descriptionText'), content: productDesc },
    { name: translate('label.orderSummary.shippingText'), content: 'We currently ship in the UK and worldwide. <br /> <br /> We accept payment via PayPal, ClearPay, and major card payment providers (including Visa, Mastercard, Maestro, and Switch) and more. ', },
    { name: translate('common.label.returnsText'), content: 'Items may be returned for a full refund within 14 days from the date an order was received.', }
  ]
  useEffect(() => {
    if (compareProductsAttributes?.length < 0) return
    let mappedAttribsArrStr: any = compareProductsAttributes?.map((o: any) => o?.customAttributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr?.map((o: any) => o?.fieldName))
    setAttributeNames(mappedAttribsArrStr)
  }, [compareProductsAttributes])

  useEffect(() => { closeSidebar() }, [config])

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
  const createProductInterest = async () => {
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      openLoginSideBar()
      return
    }
    else {
      try {
        const response = await axios.post(NEXT_CUSTOMER_PRODUCT_INTEREST, {
          id: user?.userId,
          productId: product?.recordId,
        })

        if (response?.data) {
          setAlert({
            type: 'success',
            msg: 'Product interest registered successfully'
          })
        }
      } catch (error) {
        console.log(error, 'error')
        setAlert({
          type: 'error',
          msg: 'Failed to register product interest'
        })
      }
    }

  }
  const [selectedAttrData, setSelectedAttrData] = useState({ productId: product?.recordId, stockCode: product?.stockCode, ...product, })
  useEffect(() => {
    if (allProductsByCategory?.length < 0) return
    let mappedAttribsArrStr = allProductsByCategory?.map((o: any) => o.attributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr?.map((o: any) => o.display))
    setAttributeNames(mappedAttribsArrStr)
  }, [allProductsByCategory])

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
    const filteredProduct = getFilteredProduct()
    const url = !isPreview ? NEXT_GET_PRODUCT : NEXT_GET_PRODUCT_PREVIEW
    const currentSlug = filteredProduct?.slug ? filteredProduct?.slug?.replaceAll('products/', '') : slug
    const response: any = await axios.post(url, { slug: currentSlug })
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
      setProductInfo({
        recordId: response?.data?.product?.recordId,
        variantGroupCode: response?.data?.product?.variantGroupCode,
        productCode: response?.data?.product?.productCode,
      })
    }
    //debugger
    const product: any = response?.data?.product
    let color = ''
    if (product?.variantGroupCode) {
      color = product?.variantGroupCode?.split('-')[1]
    }
    const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
    recordAnalytics(AnalyticsEventType.PDP_VIEW, { ...product, ...{ ...extras }, color, itemIsBundleItem: false, entityType: Product, })
    if (response?.data?.product) {
      setUpdatedProduct(response.data.product)
      setSelectedAttrData({
        productId: response.data.product.recordId,
        stockCode: response.data.product.stockCode,
        ...response.data.product,
      })
      if (typeof window !== "undefined" && window?.ch_session) {
        window?.ch_product_view_before(generateDataForEngage(response.data.product))
      }
    }
  }

  const generateDataForEngage = (product: any) => {
    if (!product) return null;
    if (typeof window === 'undefined') return null
    const isProduction = (process.env.NODE_ENV === 'production')
    const productUrl = isProduction ? window?.location.href : SITE_ORIGIN_URL + new URL(window?.location.href).pathname;
    const dataForEngage = {
      item: {
        item_id: product?.variantGroupCode || product?.productCode || EmptyString,
        title: product?.name || EmptyString,
        sku: product?.productCode || EmptyString,
        categories: product?.classification?.category || [],
        base_category: product?.classification?.mainCategoryName ? product?.classification?.mainCategoryName : product?.classification?.category || EmptyString,
        collection_name: product?.collections ? product?.collections[0]?.name : EmptyString,
        description: product?.fullName || EmptyString,
        product_url: productUrl,
        image_url: product?.image || EmptyString,
        availability: product?.seoAvailability || EmptyString,
        price: roundToDecimalPlaces(product?.price?.raw?.withTax)?.toString() || EmptyString,
        sale_price: roundToDecimalPlaces(product?.listPrice?.raw?.withTax)?.toString() || EmptyString,
        brand: product?.brand || EmptyString,
        variant: {
          id: product?.variantGroupCode || product?.productCode || EmptyString,
          title: product?.name || EmptyString,
          sku: product?.productCode || EmptyString,
          image_url: product?.image || EmptyString,
          product_url: productUrl,
          price: product?.price?.maxPrice?.toFixed(2)?.toString() || EmptyString,
          sale_price: product?.price?.minPrice?.toFixed(2)?.toString() || EmptyString,
          availability: product?.seoAvailability || EmptyString,
          metadata: {
            color: (product?.customAttributes?.length >= 2)
              ? product?.customAttributes[0]?.key == "global.colour" ? product?.customAttributes[0]?.value : product?.customAttributes[1]?.value || EmptyString
              : EmptyString,
            size: (product?.customAttributes?.length >= 4)
              ? product?.customAttributes[2]?.key == "clothing.size" ? product?.customAttributes[2]?.value : product?.customAttributes[3]?.value || EmptyString
              : EmptyString,
            weight: 0,
            weight_unit: EmptyString,
            make: EmptyString,
            model: product?.brand || EmptyString,
            rating: 0,
          },
        },
        customAttributes: product?.customAttributes || EmptyString,
      },
      item_id: product?.variantGroupCode || product?.productCode || EmptyString,
    };
    return dataForEngage;
  };

  const memoizedDataForEngage = useMemo(() => generateDataForEngage(product), [product]);

  useEffect(() => {
    fetchProduct()
    setIsCompared('false')
  }, [slug, currency])

  useEffect(() => {
    const { entityId, entityName, entityType, entity } = KEYS_MAP
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
      setProductInfo(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFilteredProduct = () => {
    if (selectedFilters?.length) {
      const productSupportedAttributes = product?.customAttributes?.map((x: any) => x?.display) || []
      const matchingAttrFilters = selectedFilters?.filter((x: any) => productSupportedAttributes.includes(x?.name))
      const variantProducts = product?.variantProducts
      if (variantProducts?.length) {
        let filteredProducts = new Array<any>()
        matchingAttrFilters?.forEach((attrFilter: any) => {
          if (filteredProducts?.length === 0) {
            filteredProducts = variantProducts?.filter((x: any) => {
              const findAttr = x?.attributes?.find((y: any) => matchStrings(y?.fieldName, attrFilter?.name, true) && matchStrings(y?.fieldValue, attrFilter?.value, true))
              return (findAttr != null)
            })
          } else {
            filteredProducts = filteredProducts?.filter((x: any) => {
              const findAttr = x?.attributes?.find((y: any) => matchStrings(y?.fieldName, attrFilter?.name, true) && matchStrings(y?.fieldValue, attrFilter?.value, true))
              return (findAttr != null)
            })
          }
        })

        if (filteredProducts?.length) {
          return { productId: filteredProducts[0]?.recordId || filteredProducts[0]?.productId, stockCode: filteredProducts[0]?.stockCode, slug: filteredProducts[0]?.slug || filteredProducts[0]?.link }
        }
      }
    }
    return null
  }

  const handleNotification = () => {
    openNotifyUser(product?.recordId)
  }
  const filterAndGroupProducts = (
    products: any[] | undefined,
    filterKey: string,
    groupKey: string
  ) => {
    return groupBy(
      (products || []).filter((item: { groupNameList: { relatedTypeCode: string }[] }) =>
        item?.groupNameList?.some((group: { relatedTypeCode: string }) =>
          group?.relatedTypeCode.toLowerCase() === filterKey
        )
      ),
      () => groupKey
    );
  };
  const usedProducts = filterAndGroupProducts(relatedProducts?.relatedProducts, "used", "Used");
  const buyingProducts = filterAndGroupProducts(relatedProducts?.relatedProducts, "buying options", "Buying Options");
  const accessoriesProducts = filterAndGroupProducts(relatedProducts?.relatedProducts, "accessories", "Accessories");
  const compareProducts = filterAndGroupProducts(relatedProducts?.relatedProducts, "compare", "Compare");
  const overlayImages = product?.images?.filter((x: any) => matchStrings(x?.tag, "overlay", true));
  const overlayImage = product?.images?.find((x: any) => matchStrings(x?.tag, "overlay", true));
  interface MediaItem {
    [key: string]: string; // Can be either image or url or any other property name
  }

  interface GetProductMediaOptions {
    mediaProperty?: string; // Property name to use for the media URL (defaults to 'image')
  }

  const getProductMedia = (
    productData: any,
    selectedAttrImage?: string,
    options: GetProductMediaOptions = { mediaProperty: 'image' }
  ) => {
    const productImages = productData?.images || [];
    const productVideos = productData?.videos || [];
    const { mediaProperty = 'image' } = options;

    let images = [...productImages];

    if (selectedAttrImage) {
      images.push({ [mediaProperty]: selectedAttrImage });
    }

    // Remove duplicates
    let data = images.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t[mediaProperty] === value[mediaProperty])
    );

    // Include videos if they exist
    if (productVideos.length > 0) {
      data = [...productImages, ...productVideos].filter(
        (value, index, self) =>
          index === self.findIndex((t) => t[mediaProperty] === value[mediaProperty])
      );
    }

    // Format for image gallery
    return data.map((item) => ({
      original: item[mediaProperty],
      thumbnail: item[mediaProperty],
    }));
  };

  // Usage examples:
  const images = getProductMedia(product, selectedAttrData?.image);
  // Uses 'image' as default property

  const usedImages = getProductMedia(usedProducts?.Used?.at(0), selectedAttrData?.image, { mediaProperty: 'url' });
  // Uses 'url' as the property name

  const handleTogglePersonalizationDialog = () => {
    if (!isPersonalizeLoading) showEngravingModal((v) => !v)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === selectedAttrData?.productId?.toUpperCase())
        if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier && !selectedAttrData?.flags?.sellWithoutInventory) {
          setAlert({
            type: 'error',
            msg: translate('common.message.cartItemMaxAddedErrorMsg'),
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
            productId: selectedAttrData?.productId || selectedAttrData?.recordId,
            qty: quantity,
            manualUnitPrice: product?.price?.raw?.withTax,
            stockCode: selectedAttrData?.stockCode || selectedAttrData?.productCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { product: selectedAttrData }
        )
        setCartItems(item)
        if (typeof window !== 'undefined') {
          //debugger
          const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
          const cartItems = getItem('cartItems')
          recordAnalytics(AnalyticsEventType.ADD_TO_BASKET, { ...product, ...{ ...extras }, cartItems, addToCartType: "Single - From PDP", itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Product, })

          if (currentPage) {
            //debugger
            const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
            recordAnalytics(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemListName: 'Product View', itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Product, })
          }
          if (window?.ch_session && memoizedDataForEngage) {
            window?.ch_add_to_cart_before(memoizedDataForEngage)
          }
        }
      },
      shortMessage: '',
    }
    if (selectedAttrData?.currentStock <= 0 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory) {
      buttonConfig.title = translate('label.product.notifyMeText')
      buttonConfig.action = async () => handleNotification()
      buttonConfig.type = 'button'
    } else if (product?.componentProducts?.length > 0) {
      buttonConfig.title = "Add Bundle"
    } else if (product?.price?.raw?.withTax == 0) {
      buttonConfig.title = translate('label.product.notifyMeText')
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
        buttonConfig.title = translate('label.product.preOrderText')
        buttonConfig.shortMessage = product?.preOrder?.shortMessage
        return buttonConfig
      } else if (
        product?.flags?.sellWithoutInventory ||
        selectedAttrData?.sellWithoutInventory
      ) {
        buttonConfig = {
          title: translate('label.basket.addToBagText'),
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o?.productId === selectedAttrData?.productId?.toUpperCase())
            if (selectedAttrData?.currentStock === cartLineItem?.qty) {
              setAlert({
                type: 'error',
                msg: translate('common.message.cartItemMaxAddedErrorMsg'),
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
              //debugger
              const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
              const cartItems = getItem('cartItems')
              recordAnalytics(AnalyticsEventType.ADD_TO_BASKET, { ...product, ...{ ...extras }, cartItems, addToCartType: "Single - From PDP", itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Product, })

              if (currentPage) {
                //debugger
                const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
                recordAnalytics(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemListName: 'Product View', itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Product, })
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

  const buttonConfig = useMemo(() => buttonTitle(), [
    product,
    selectedAttrData,
    quantity,
    cartItems,
    user,
    // add any other dependencies used in buttonTitle if needed
  ]);

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
        setIsLoading(false)
        openCart()
      } catch (error) {
        console.log(error, 'err')
      }
    }
    setIsLoading(true)
    asyncHandler()
  }

  useEffect(() => {
    const isEngraving =
      !!relatedProducts?.relatedProducts?.filter(
        (item: any) => item?.relatedType === ITEM_TYPE_ADDONS
      ).length
    setIsEngravingAvailable(isEngraving)
  }, [relatedProducts])

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    openWishlist()
  }
  const handleWishList = () => {
    const productId = selectedAttrData?.productId || selectedAttrData?.recordId
    if (isInWishList(productId)) {
      deleteWishlistItem(user?.userId, productId)
      removeFromWishlist(productId)
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
      //debugger
      recordAnalytics(AnalyticsEventType.VIEW_WISHLIST, { header: product?.name, currentPage: 'PDP', })
      recordAnalytics(AnalyticsEventType.ADD_TO_WISHLIST, { ...product, productAvailability, header: 'PDP', currentPage: 'PDP', })
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.VIEW_WISHLIST, { header: 'PDP', currentPage, })
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
            productId: productId,
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

  const onStoreStockCheck = () => {
    setOpenStockCheckModal(true)
  }

  const handleProductBundleUpdate = (bundledProduct: any) => {
    if (bundledProduct && bundledProduct?.id) {
      let clonedProduct = Object.assign({}, product)
      if (clonedProduct && clonedProduct?.componentProducts) {
        setUpdatedProduct(clonedProduct)
      }
    }
  }

  const breadcrumbs = product?.breadCrumbs?.filter((item: any) => item.slugType !== SLUG_TYPE_MANUFACTURER)
  const attrGroup = groupBy(product?.customAttributes, 'key')
  const tabProducts = groupBy(relatedProducts?.relatedProducts || [], (item) => item?.groupNameList?.at(0)?.relatedTypeCode);

  const productTabsRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (!productTabsRef.current) return;
      const rect = productTabsRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top <= 0);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return null
  }

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
    if (item?.message && item?.messageCode && item?.messageCode !== "C001") {
      setAlert({ type: 'error', msg: item?.message })
    }
    setCartItems(item)
    openCart()
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  useEffect(() => {
    function handleSetAnalyticsData({ detail: analyticsData }: any) {
      setAnalyticsData(analyticsData)
    }

    function handleScroll() {
      const addButton = document.getElementById('add-to-cart-button');
      if (addButton) {
        const addButtonRect = addButton.getBoundingClientRect();
        const isAddButtonVisible = addButtonRect.top < window?.innerHeight;
        setShowMobileCaseButton(isAddButtonVisible);
      }
    }

    window?.addEventListener('scroll', handleScroll);
    window.addEventListener(CUSTOM_EVENTS.ProductViewed, handleSetAnalyticsData)
    return () => {
      window?.removeEventListener('scroll', handleScroll);
      window?.removeEventListener(CUSTOM_EVENTS.ProductViewed, handleSetAnalyticsData);
    };
  }, []);

  useEffect(() => {
    const fetchLookbook = async (stockcode: string) => {
      const lookbookData: any = await axios.post(NEXT_GET_LOOKBOOK, { stockcode })
      const slug: string = lookbookData?.data?.[0]?.slug
      if (slug) {
        const lookbookBySlug: any = await axios.post(NEXT_GET_LOOKBOOK_BY_SLUG, { slug })
        if (lookbookBySlug?.status === 200) {
          setLookbookData(lookbookBySlug?.data)
        }
      }
    }
    if (product?.stockCode) {
      fetchLookbook(product.stockCode)
    }
  }, [product])

  const showGwpDetails = () => {
    setShowGwpDetail(true)
  }
  const closeGwpDetails = () => {
    setShowGwpDetail(false)
  }

  const exitFullscreen = () => {
    if (document) document?.exitFullscreen();
    return
  };
  const weloveAttribute = product?.customAttributes?.find(
    (attr: { key: string }) => attr?.key === "web.welove"
  );

  const cashbackAmount = product?.customAttributes?.find(((item: any) => item?.key == "cashback.amount"))?.value
  const cashbackDescription = product?.customAttributes?.find(((item: any) => item?.key == "cashback.description"))?.value
  const renderCustomControls = () =>
    fullscreen ? (
      <button className='absolute items-center justify-center rounded flex-end icon-container right-5 z-999' onClick={exitFullscreen}>
        <XMarkIcon className="w-8 h-8 mt-3 text-white border-2 rounded-sm hover:text-orange-500 hover:border-orange-500" aria-hidden="true" />
      </button>
    ) : null;

  const customRenderItem = (item: any) => {
    return (
      <div className="flex justify-center image-gallery-image">
        <img src={generateUri(item?.original, "h=2000&fm=webp") || IMG_PLACEHOLDER} alt={product?.name} height={1000} width={1000} className="!object-contain" />
      </div>
    );
  };

  const customRenderThumbInner = (item: any) => {
    return (
      <span className='relative image-gallery-thumbnail-inner'>
        <img className='image-gallery-thumbnail-image' src={generateUri(item?.thumbnail, "h=150&fm=webp") || IMG_PLACEHOLDER} alt={product?.name || 'product'} height={150} width={100} />
      </span>
    );
  };

  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES = "absolute top-3 start-3";
    return (
      <div className={CLASSES}>
        <ProductTag product={product} />
      </div>
    )
  };

  const renderVariants = () => {
    return (
      <div>
        {product &&
          <AttributesHandler product={product} variant={selectedAttrData} setSelectedAttrData={setSelectedAttrData} variantInfo={variantInfo} handleSetProductVariantInfo={handleSetProductVariantInfo} sizeInit={sizeInit} setSizeInit={setSizeInit} />
        }
      </div>
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="flex flex-col">
        {product.shortDescription != "" &&
          <>
            <hr className="pt-10 mt-10 sm:pt-10 border-slate-200 dark:border-slate-700" />
            <h2 className="text-2xl font-semibold">{translate('label.product.productDetailsText')}<span className='sr-only'>{' '}of {product?.name}</span></h2>
            <div dangerouslySetInnerHTML={{ __html: product.shortDescription, }} className="hidden mt-2 text-sm text-gray-500 sm:block product-detail-description" />
          </>
        }
      </div>
    );
  };

  const renderProductSpecification = () => {
    return (
      product?.customAttributes?.length > 0 &&
      !product.customAttributes.some((attr: { key: string }) => attr.key === 'clothing.size' || attr.key === 'global.colour') && (
        <div className="w-full rounded-2xl sm:space-y-2.5">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left rounded-lg bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-100/80 dark:hover:bg-slate-200/60 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                  <h2 className="text-accordion dark:text-black">{translate('label.product.technicalSpecificationText')}<span className='sr-only'>{' '}of {product?.name}</span></h2>
                  {!open ? (
                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className={` description-text dark:text-black`} as="div" >
                  <TechnicalSpecifications attrGroup={attrGroup} product={product} deviceInfo={deviceInfo} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      )
    );

  };

  const renderReviews = () => {
    return (
      <>
        <hr className="pt-5 mt-5 sm:pt-5 border-slate-200 dark:border-slate-700" />
        <div className="" id='productReview'>
          <h2 className="flex-1 pb-0 pr-4 mb-2 text-xl font-semibold md:text-4xl dark:text-black">Rating & Review<span className='sr-only'>{' '}of {product?.name}</span></h2>
          <h2 className="flex items-center mt-4 text-2xl font-semibold sm:mt-8">
            <StarIcon className="w-7 h-7 mb-0.5 text-yellow-500" />
            <span className="ml-1.5 dark:text-black"> {reviews?.review?.ratingAverage} <span className='text-sm font-normal text-gray-500'>({reviews?.review?.productReviews?.length} Reviews)</span></span>
          </h2>

          <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
              {reviews?.review?.productReviews?.length > 0 && reviews?.review?.productReviews?.map((review: any, reviewIdx: number) => (
                <div key={`review-${reviewIdx}`}>
                  <ReviewItem data={{ comment: review?.comment, date: review?.postedOn, name: review?.title, starPoint: review?.rating, }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const sellableTypeMap: Record<string, string> = {
    Each: "Each",
    Pallet: `Pallet of ${product?.itemPerCarton}`,
    Both: "Both",
    Carton: `Carton of ${product?.itemPerCarton}`,
    CartonPacks: `Carton of ${product?.itemPerCarton}`,
  };

  const renderSellableType = () =>
    product?.sellableType ? (
      <div className='flex justify-start gap-2 divide-x divide-gray-200 p-none'>
        <h4 className='text-lg font-normal text-black'>Sellable Type: {sellableTypeMap[product.sellableType]}</h4>
      </div>
    ) : null;


  const GwpModal = ({ gwp, show, onClose }: any) => (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <div className="flex items-center justify-center h-full px-4 text-center">
          <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <div className="relative w-full max-w-5xl p-8 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl">
              <span className="absolute top-3 right-3">
                <ButtonClose onClick={onClose} />
              </span>
              <div className="flex flex-col items-center">
                <img alt='' src={gwp?.image} className='h-80' />
                <div className='mt-6 text-xl font-semibold'>{gwp?.brand}</div>
                <div className='mt-1 text-2xl font-semibold'>{gwp?.name}</div>
                <div dangerouslySetInnerHTML={{ __html: gwp?.description }} className="mt-2 text-sm text-gray-500" />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
  const renderRelatedProducts = () => {
    const gwpProduct = relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, 'GWP', true)) || [];
    if (!gwpProduct.length) return null;

    return (
      <div className='flex flex-col'>
        {gwpProduct.map((gwp: any, pIdx: number) => (
          <Fragment key={pIdx}>
            <div className='flex items-center gap-4 p-2 cursor-pointer bg-slate-100 rounded-xl hover:bg-slate-200' onClick={showGwpDetails}>
              <div className='p-1 bg-white border border-gray-400 rounded-lg'><img src={gwp?.image} className='object-cover w-10 h-10' /></div>
              <div className='text-sm text-gray-800'>Comes with {gwp?.name}</div>
              <InformationCircleIcon className='w-5 h-5 text-gray-400' />
            </div>
            <GwpModal gwp={gwp} show={showDetails} onClose={closeGwpDetails} />
          </Fragment>
        ))}
      </div>
    );
  };


  const renderSectionContent = () => {
    return (
      featureToggle?.features?.enableRichPDP ? (
        <>
        <RichProductView key={product?.recordId || product?.slug} product={product} cashbackAmount={cashbackAmount} cashbackDescription={cashbackDescription} selectedOption={selectedOption} buyingProducts={buyingProducts?.['Buying Options']} weloveAttribute={weloveAttribute} isGuestUser={isGuestUser} handleWishList={handleWishList} isInWishList={isInWishList} maxBasketItemsCount={maxBasketItemsCount} isEngravingAvailable={isEngravingAvailable} user={user} promotions={promotions} showMobileCaseButton={showMobileCaseButton} quantity={quantity} buttonConfig={buttonConfig} setQuantity={setQuantity} setSelectedOption={setSelectedOption} usedProduct={usedProducts?.Used} attrGroup={attrGroup} createProductInterest={createProductInterest} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} selectedAttrData={selectedAttrData} renderRelatedProducts={renderRelatedProducts} renderVariants={renderVariants} showEngravingModal={showEngravingModal} renderSellableType={renderSellableType} setOpenStockCheckModal={setOpenStockCheckModal} openStoreLocatorModal={openStoreLocatorModal} onStoreStockCheck={onStoreStockCheck} isMobile={isMobile} showStickyBar={showStickyBar} />
        </>
      ) : (
        <DefaultProductView product={product} detailsConfig={detailsConfig} config={config} isEngravingAvailable={isEngravingAvailable} renderProductSpecification={renderProductSpecification} isInWishList={isInWishList} handleWishList={handleWishList} buttonConfig={buttonConfig} showMobileCaseButton={showMobileCaseButton} featureToggle={featureToggle} isMobile={isMobile} onStoreStockCheck={onStoreStockCheck} setOpenStockCheckModal={setOpenStockCheckModal} showEngravingModal={showEngravingModal} selectedAttrData={selectedAttrData} renderSellableType={renderSellableType} openStoreLocatorModal={openStoreLocatorModal} promotions={promotions} deviceInfo={deviceInfo} reviews={reviews} renderVariants={renderVariants} attrGroup={attrGroup} renderRelatedProducts={renderRelatedProducts} defaultDisplayMembership={defaultDisplayMembership} />
      )
    )
  }

  const productTabs = [
    product?.description != null && {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="w-full space-y-4">
          <div className="text-sm text-gray-800 description-html description-p-long" dangerouslySetInnerHTML={{ __html: product?.description }} />
        </div>
      )
    },
    product?.customAttributes?.some((attr: { key: any }) => attr?.key?.startsWith('Specs')) && {
      id: 'specs',
      label: 'Specs',
      content: (
        <>
          <div className="p-4 !px-0 overflow-x-auto w-full">
            {product && product?.customAttributes?.length > 0 ? <table className="w-full border border-gray-300">
              <thead>
                <tr className="text-left bg-gray-200">
                  <th className="p-3 border border-gray-300">Specification</th>
                  <th className="p-3 border border-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                {product?.customAttributes?.filter((attr: { key: any }) => attr?.key?.startsWith('Specs'))?.map((attr: any, index: number) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="p-3 border border-gray-300">{attr?.display}</td>
                    <td
                      className="p-3 border border-gray-300"
                      dangerouslySetInnerHTML={{ __html: attr?.value }}
                    />
                  </tr>
                ))}
              </tbody>
            </table> : <div className='flex justify-center text-xl font-semibold text-center text-gray-400'>No product specifications available.</div>}
          </div>
        </>
      )
    },
    {
      id: 'Reviews',
      label: 'Reviews',
      content: (
        <div className="space-y-4 review-none-section container-tabs">
          {reviews?.review?.productReviews?.length > 0 ? renderReviews() :
            <div className='flex flex-col justify-start text-xl font-semibold text-left text-gray-400'>
              This product hasn't been reviewed yet. Be the first to share your thoughts!
              <div className='w-full mt-4'><ReviewInput data={product} productId={product?.productId ?? product?.recordId} setSubmitReview={setSubmitReview} deviceInfo={deviceInfo} /></div>
            </div>}
        </div>
      )
    },
    product && product?.videos?.length > 0 && {
      id: 'Videos',
      label: 'Videos',
      content: (
        <div className="space-y-4 container-tabs">
          {product && product?.videos?.length > 0 ? <div className="flex flex-col">
            {product?.videos?.map((video: any, index: any) => {
              let videoUrl = video?.url?.includes("youtu.be")
                ? video?.url?.replace("youtu.be/", "www.youtube.com/embed/")
                : video?.url?.startsWith("www.")
                  ? `https://${video?.url}`
                  : video?.url;
              return (
                <div key={index} className="mb-4 overflow-hidden border rounded-lg">
                  <iframe src={videoUrl} width="100%" height="400" allowFullScreen className="w-full aspect-video" ></iframe>
                </div>
              );
            })}
          </div> : <div className='flex justify-center text-xl font-semibold text-center text-gray-400'>This product hasn't any video!</div>}
        </div>
      )
    },
    compareProducts?.Compare && {
      id: 'Compare',
      label: 'Compare',
      content: (
        <div className="space-y-4">
          <TabProductCompare products={compareProducts?.Compare} maxBasketItemsCount={maxBasketItemsCount} deviceInfo={deviceInfo} />
        </div>
      )
    },
    tabProducts?.["KITS AND BUNDLES"] && {
      id: 'Kits and bundles',
      label: 'Kits and bundles',
      content: (
        <div className="space-y-4">
          <TabProductCard products={tabProducts?.["KITS AND BUNDLES"]} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} />
        </div>
      )
    },
    accessoriesProducts?.Accessories && {
      id: 'Accessories',
      label: 'Accessories',
      content: (
        <div className="space-y-4">
          <TabProductCard products={accessoriesProducts?.Accessories} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} />
        </div>
      )
    },
    {
      id: 'QnA',
      label: 'Q&A',
      content: (
        <DiscussionEmbed
          shortname='parkcameras'
          config={
            {
              url: `${baseUrl}${product?.link}` || '',
              identifier: product?.stockCode || '',
              title: product?.name || 'Product Discussion',
              language: 'en-GB'
            }
          }
        />
      )
    }
  ].filter(Boolean);

  const alsoLikeProducts = relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, 'ALSOLIKE', true)) || [];
  const upgradeProducts = relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, 'UPGRADE', true)) || [];

  const renderRelatedSection = (products: any[], type: 'ALSOLIKE' | 'UPGRADE') => {
    if (!products.length) return null;

    const isUpgrade = type === 'UPGRADE';

    return (
      <>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="container flex flex-col w-full !px-0 py-4 mx-auto page-container sm:!px-0 lg:!px-0 2xl:!px-0 md:!px-0 pdp-related-product-list slider-btn-css">
          {featureToggle.features?.enableForPCSite && isUpgrade ? (
            <>
              <h3 className="mb-1 font-semibold heading dark:text-black">Upgrade Your Kit & Save 20%</h3>
              <p className="pb-6 text-sm text-black sm:pb-10">
                Save 20% on selected OM System accessories when bought with this item. Add both to your basket to apply the offer.
              </p>
            </>
          ) : (
            <h3 className="pb-6 text-2xl font-semibold md:text-3xl sm:pb-10 dark:text-black">
              {translate('label.product.youMayAlsoLikeText')}
            </h3>
          )}
          <RelatedProductWithGroup
            products={products}
            productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            featureToggle={featureToggle}
          />
        </div>
      </>
    );
  };
  const renderUsedRelatedSection = () => {
    return (
      <>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="container flex flex-col w-full !px-0 py-4 mx-auto page-container sm:!px-0 lg:!px-0 2xl:!px-0 md:!px-0 pdp-related-product-list slider-btn-css scroll-mt-32" id="usedSection">
          <h3 className="mb-1 font-semibold heading dark:text-black">Used Products</h3>
          <RelatedProductWithGroup
            products={usedProducts?.Used?.slice(1)}
            productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            featureToggle={featureToggle}
          />
        </div>
      </>
    );
  };
  return (
    <>
      <CacheProductImages data={cachedImages} setIsLoading={setIsLoading} />
      {featureToggle?.features?.enableRichPDP &&
        <ProductSocialProof data={analyticsData} featureToggle={featureToggle} />
      }
      <main className="mt-2 container-pdp sm:mt-5 lg:mt-11 dark:bg-white">
        <div className='flex flex-1 px-4 mb-1 sm:px-0 sm:mb-4 '>
          {breadcrumbs && (
            <BreadCrumbs items={breadcrumbs} currentProduct={product} />
          )}
        </div>

        <div className="overflow-visible lg:flex product-detail-section">
          {isMobile ? (
            <div className="w-full lg:w-[55%]">
              <Swiper slidesPerView={1} spaceBetween={30} navigation loop className="mySwiper" >
                <SwiperSlide>
                  <div className="relative">
                    {selectedOption === "used" ? (
                      <img src={generateUri(usedProducts?.Used?.at(0)?.images?.at(0)?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full" alt={product?.name} />
                    ) : (
                      <img src={generateUri(product?.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full" alt={product?.name} />
                    )}
                    {renderStatus()}
                  </div>
                </SwiperSlide>
                {selectedOption === "used" ? (
                  usedProducts?.Used?.at(0)?.images?.map((item: any, index: number) => {
                    if (item?.tag === "specification") return null;
                    return (
                      <SwiperSlide key={index}>
                        <div className="relative">
                          <img src={generateUri(item?.url, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full" alt={product?.name} />
                        </div>
                      </SwiperSlide>
                    );
                  })
                ) : (
                  product?.images?.map((item: any, index: number) => {
                    if (item?.tag === "specification") return null;
                    return (
                      <SwiperSlide key={index}>
                        <div className="relative">
                          <img src={generateUri(item?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full" alt={product?.name} />
                        </div>
                      </SwiperSlide>
                    );
                  })
                )}
              </Swiper>
            </div>
          ) : (
            featureToggle?.features?.isImageGallery ? (
              <div className={`w-full sticky top-0 z-10 product-image-border sticky-container ${featureToggle?.features?.enableRichPDP ? "lg:w-[50%]" : "lg:w-[55%]"}`} >
                <ImageGallery
                  thumbnailAlt={product?.name}
                  thumbnailTitle={product?.name}
                  originalAlt={product?.name}
                  items={selectedOption === "used" ? usedImages ?? [] : images ?? []}
                  thumbnailPosition="left"
                  showPlayButton={false}
                  additionalClass={`app-image-gallery w-full ${fullscreen ? 'fullscreen' : ''}`}
                  onScreenChange={toggleFullscreen}
                  disableThumbnailScroll={false}
                  renderCustomControls={renderCustomControls}
                  renderItem={customRenderItem}
                  renderThumbInner={customRenderThumbInner}
                />
                {selectedOption === "new" ? (
                  <>
                    {overlayImages?.length > 0 &&
                      <div className='absolute z-10 top-1 right-1 border border-[#ddd] shadow-md'>
                        <img
                          src={generateUri(overlayImage?.image, 'h=100&fm=webp') || IMG_PLACEHOLDER}
                          className='overlayImage'
                          width="100"
                          height="100"
                          title="Free Gift"
                          alt={product?.name} />
                      </div>
                    }
                  </>
                ) : (
                  <></>
                )}
                {featureToggle?.features?.enableRichPDP && (<p className='pt-4 text-sm text-gray-500'>Product Code: {product?.productCode}</p>)}
              </div>
            ) : (
              <div className={`w-full lg:w-[55%] sticky top-0 z-10 sticky-container ${featureToggle?.features?.enableRichPDP ? "lg:w-[50%]" : "lg:w-[55%]"}`}>
                <div className="relative">
                  <div className="relative aspect-w-16 aspect-h-16">
                    {selectedOption === "used" ? (
                      usedProducts?.Used?.at(0)?.images?.slice(0, 1)?.map((image: any, index: number) => (
                        <img key={index} src={generateUri(image?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full rounded-2xl" alt={product?.name} />
                      ))
                    ) : (
                      <img src={generateUri(product?.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full rounded-2xl" alt={product?.name} />
                    )}
                  </div>
                  {relatedProducts && relatedProducts?.relatedProducts?.filter((x: any) => matchStrings(x?.relatedType, 'GWP', true))?.length > 0 &&
                    <div className='absolute z-10 right-1 top-1'>
                      <GiftIcon className='w-16 h-16 p-4 mr-0 text-white bg-red-500 rounded-full' />
                    </div>
                  }
                  {renderStatus()}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
                  {selectedOption === "used" ? (
                    usedProducts?.Used?.at(0)?.images?.slice(1, product?.images?.length)?.filter((image: any) => image.tag !== "specification").map((item: any, index: number) => (
                      <div key={index} className="relative aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16" >
                        <img src={generateUri(item?.url, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full rounded-2xl" alt={product?.name} />
                      </div>
                    ))
                  ) : (
                    product?.images?.slice(1, product?.images?.length)?.filter((image: any) => image.tag !== "specification").map((item: any, index: number) => (
                      <div key={index} className="relative aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16" >
                        <img src={generateUri(item?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full rounded-2xl" alt={product?.name} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          )}
          <div className={`px-4 sm:px-0 w-full pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10 pdp-right-section ${featureToggle?.features?.enableRichPDP ? "lg:w-[50%]" : "lg:w-[45%]"}`}>
            {renderSectionContent()}
          </div>
        </div>
        {featureToggle?.features?.enableCustomToolWidget &&
          <>
            <div className="flex w-full bg-white product-tab-active">
              <div className="lg:mx-auto container-ffx">
                <PDPDetails product={product} description={product?.description} />
              </div>
            </div>
            <div className="pb-10 bg-white sm:pb-0">
              <div className="grid grid-cols-12 px-0 lg:mx-auto container-ffx sm:grid-cols-12 sm:px-4 md:px-0 lg:px-6 2xl:px-0">
                <ProductSpecification attrGroup={attrGroup} product={product} deviceInfo={deviceInfo} />
              </div>
            </div>
          </>
        }
        {/* {LookBook} */}
        {lookbookData && (
          <LookbookGrid lookbookData={lookbookData} defaultDisplayMembership={defaultDisplayMembership} featureToggle={featureToggle} />
        )}
        {/* DETAIL AND REVIEW */}
        {featureToggle?.features?.enableEngage &&
          <>
            <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.ALSO_BOUGHT} campaignData={campaignData} isSlider={true} productPerRow={4} product={product} />
            <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.BOUGHT_TOGETHER} campaignData={campaignData} isSlider={true} productPerRow={4} product={product} />
          </>
        }

        {product?.componentProducts && !featureToggle.features?.enableForPCSite && (
          <>
            <hr className="py-6 my-2 border-slate-200 dark:border-slate-700" />
            <Bundles price={isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax} product={product} products={product?.componentProducts} productBundleUpdate={handleProductBundleUpdate} deviceInfo={deviceInfo} onBundleAddToCart={bundleAddToCart} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </>
        )}
        {alternativeProducts?.length > 0 && (
          <>
            <hr className="py-6 my-2 border-slate-200 dark:border-slate-700" />
            <div className="flex flex-col w-full px-0 pt-10 pb-6 mx-auto pdp-compare-section">
              <PDPCompare compareProductsAttributes={compareProductsAttributes} name={data?.brand || ''} pageConfig={config} products={alternativeProducts} deviceInfo={deviceInfo} activeProduct={product} maxBasketItemsCount={maxBasketItemsCount} attributeNames={attributeNames} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
            </div>
          </>
        )}
        {featureToggle?.features?.enableProductSpecification && (attrGroup['material']?.length > 0 || attrGroup['lookAfterMe']?.length > 0 || attrGroup['product.perfectfor']?.length > 0 || attrGroup['product.fabriccare']?.length > 0 || attrGroup['product.washcare']?.length > 0 || attrGroup['whyweloveit']?.length > 0) &&
          <div className="px-4 mt-12 sm:px-0 sm:mt-12">
            <hr className="border-slate-200 dark:border-slate-700" />
            <div className="flex flex-col w-full px-0 pt-6 lg:mx-auto sm:container page-container product-specification-section">
              <ProductSpecifications attrGroup={attrGroup} product={product} deviceInfo={deviceInfo} />
              {renderDetailSection()}
            </div>
          </div>
        }
        <div className="w-full px-4 pt-6 mx-auto sm:px-0 lg:max-w-none sm:pt-8">
          {renderRelatedSection(alsoLikeProducts, 'ALSOLIKE')}
          {featureToggle.features?.enableForPCSite && renderRelatedSection(upgradeProducts, 'UPGRADE')}
          {featureToggle?.features?.enableEngage &&
            <>
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.SIMILAR_PRODUCTS} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} title="Similar Products" />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} product={product} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.SIMILAR_PRODUCTS_SORTED} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.COLLAB_ITEM_VIEW} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.COLLAB_USER_ITEMS_VIEW} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.COLLAB_ITEM_PURCHASE} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.CROSS_SELL_BY_CATEGORIES} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
              <EngageProductCard productLimit={12} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} deviceInfo={deviceInfo} type={EngageEventTypes.CROSS_SELL_ITEMS_SORTED} campaignData={campaignData} product={product} isSlider={true} productPerRow={4} />
            </>
          }
          <div className={`${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`}></div>
          {isEngravingAvailable && (
            <Engraving show={isEngravingOpen} submitForm={handleEngravingSubmit} onClose={() => showEngravingModal(false)} handleToggleDialog={handleTogglePersonalizationDialog} product={product} isLoading={isLoading} />
          )}
          {!featureToggle?.features?.enableRichPDPTabs && reviews?.review?.productReviews?.length > 0 && renderReviews()}
          <div className="flex flex-col w-full">
            <div className="px-4 mx-auto sm:container page-container sm:px-6 pdp-description-section">
              <ProductDescription seoInfo={attrGroup} />
            </div>
          </div>
        </div>
        {featureToggle?.features?.enableRichPDPTabs && (
          <div ref={productTabsRef}>
            <ProductTabs tabs={productTabs} defaultActiveTab="overview" />
          </div>
        )}
        {featureToggle.features?.enableForPCSite && usedProducts?.Used?.length > 0 && renderUsedRelatedSection()}
      </main>
    </>
  )
}
