// React & Next.js
import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'

// Third-party packages
import axios from 'axios'
import _, { groupBy } from 'lodash'

// Styles
import 'swiper/swiper-bundle.min.css'

// Utilities
import { decrypt, encrypt } from '@framework/utils/cipher'
import { matchStrings, stringFormat, roundToDecimalPlaces } from '@framework/utils/parse-util'
import { getCurrentPage, sanitizeRelativeUrl, validateAddToCart, vatIncluded } from '@framework/utils/app-util'
import PricesWithDiscount from '@components/PricesWithDiscount'
// Constants
import { NEXT_GET_PRODUCT, NEXT_GET_PRODUCT_PREVIEW, NEXT_GET_ORDER_RELATED_PRODUCTS, NEXT_COMPARE_ATTRIBUTE, EmptyString, SITE_ORIGIN_URL, NEXT_GET_LOOKBOOK, NEXT_GET_LOOKBOOK_BY_SLUG, NEXT_CUSTOMER_PRODUCT_INTEREST } from '@components/utils/constants'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import { CUSTOM_EVENTS, EVENTS_MAP } from '@components/services/analytics/constants'
import { ITEM_TYPE_ADDONS, ITEM_TYPE_ALTERNATIVE, SLUG_TYPE_MANUFACTURER } from '@components/utils/textVariables'
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
import { getItem } from '@components/utils/localStorage'
import ProductCard from '@components/ProductCard'
import Link from 'next/link'
import { ArchiveBoxIcon, ChevronRightIcon, SwatchIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ReviewBadge from './ReviewBadge'
import CompareSelectionBar from './ProductCompare/compareSelectionBar'
import { Switch } from '@headlessui/react'
import { ListBulletIcon } from '@heroicons/react/20/solid'
import UsedProductCard from '@components/UsedProductCard'

// Dynamically imported components
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
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

export default function UsedProductView({ data = { images: [] }, snippets = [], recordEvent, slug, isPreview = false, relatedProductsProp, deviceInfo, config, maxBasketItemsCount, featureToggle, defaultDisplayMembership, selectedFilters = [] }: any) {
  const { openNotifyUser, addToWishlist, openWishlist, basketId, cartItems, setAlert, setCartItems, user, openCart, openLoginSideBar, isGuestUser, setIsCompared, removeFromWishlist, currency, setProductInfo, closeSidebar } = useUI()
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
  let currentPage = getCurrentPage()
  const [product, setUpdatedProduct] = useState<any>(data)
  const [isProductCompare, setProductCompare] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<any>(relatedProductsProp)
  const [quantity, setQuantity] = useState(1);

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

  useEffect(() => { closeSidebar() }, [config])

  const fetchRelatedProducts = async (productId: string) => {
    const { data: relatedProducts }: any = await axios.post(NEXT_GET_ORDER_RELATED_PRODUCTS, { recordId: productId, })
    setRelatedProducts(relatedProducts)
    const alternativeProducts = relatedProducts?.relatedProducts?.filter((item: any) => item?.relatedType == ITEM_TYPE_ALTERNATIVE)
    const stockCodeArray = alternativeProducts?.map((item: { stockCode: any }) => item?.stockCode);
    const newArray = stockCodeArray?.concat(product?.stockCode);
  }

  const [selectedAttrData, setSelectedAttrData] = useState({ productId: product?.recordId, stockCode: product?.stockCode, ...product, })

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


  interface GetProductMediaOptions {
    mediaProperty?: string; // Property name to use for the media URL (defaults to 'image')
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


  useEffect(() => {
    const isEngraving =
      !!relatedProducts?.relatedProducts?.filter(
        (item: any) => item?.relatedType === ITEM_TYPE_ADDONS
      ).length
  }, [relatedProducts])

  const breadcrumbs = product?.breadCrumbs?.filter((item: any) => item.slugType !== SLUG_TYPE_MANUFACTURER)
  if (!product) {
    return null
  }
  const [priceFilter, setPriceFilter] = useState<string>("");

  // Dynamic price range options based on the data
  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "0-60", label: "£0 - £60" },
    { value: "61-100", label: "£60 - £100" },
    { value: "100-500", label: "£100 - £500" },
    { value: "more", label: "More than £500" }
  ];

  const filteredProducts = useMemo(() => {
    if (!usedProducts?.Used) return [];

    return usedProducts.Used.filter((product) => {
      const price = product?.price?.raw?.withTax;
      const conditionAttr = product?.attributes?.find(
        (attr: any) => attr?.key === 'used.condition'
      );
      const condition = conditionAttr?.value;

      let priceMatch = true;
      let conditionMatch = true;

      if (priceFilter) {
        if (priceFilter === "more") {
          priceMatch = price > 500;
        } else {
          const [min, max] = priceFilter.split("-").map(Number);
          priceMatch = price >= min && price <= max;
        }
      }

      if (conditionFilter) {
        conditionMatch = condition?.toLowerCase() === conditionFilter.toLowerCase();
      }

      return priceMatch && conditionMatch;
    });
  }, [priceFilter, conditionFilter, usedProducts]);

  const handleChange = (val: boolean) => {
    setEnabled(val)
    setIsCompared(String(val))
  }

  // Memoize product comparison handlers
  const showCompareProducts = useCallback(() => {
    setProductCompare(true)
  }, [])

  const closeCompareProducts = useCallback(() => {
    setProductCompare(false)
  }, [])
  const toggleConditionFilter = (conditionValue: string) => {
    const newFilters = [...selectedFilters];
    const index = newFilters.findIndex(f => f.name === 'used.condition');

    // Toggle UI filter state
    setConditionFilter((prev) => (prev === conditionValue ? "" : conditionValue));

    // Update selectedFilters array
    if (index >= 0) {
      if (newFilters[index].value === conditionValue) {
        newFilters.splice(index, 1); // remove if same
      } else {
        newFilters[index].value = conditionValue; // replace value
      }
    } else {
      newFilters.push({ name: 'condition', value: conditionValue });
    }

    // Update URL without full reload
    Router.replace(
      {
        pathname: Router.pathname,
        query: { ...Router.query, filters: JSON.stringify(newFilters) },
      },
      undefined,
      { shallow: true }
    );
  };

  const conditions = useMemo(() => {
    const conditionMap = new Map();

    usedProducts?.Used?.forEach((product) => {
      const conditionAttr = product?.attributes?.find((attr: any) => attr?.key === 'used.condition');
      const condition = conditionAttr?.value?.toLowerCase();

      if (!condition) return;

      const currentStock = product?.currentStock || 0;
      const price = product.price?.raw?.withTax ?? null;

      if (conditionMap.has(condition)) {
        const entry = conditionMap.get(condition);
        entry.available += currentStock;
        entry.price = (price !== null && price < entry.price) ? price : entry.price;
        conditionMap.set(condition, entry);
      } else {
        conditionMap.set(condition, {
          label: conditionAttr.value,
          available: currentStock,
          price: price
        });
      }
    });

    return Array.from(conditionMap.values())
      .sort((a, b) => a.label.localeCompare(b.label)); // Optional sort
  }, [usedProducts?.Used]);

  const renderUsedRelatedSection = () => {
    return (
      <>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="container flex flex-col w-full !px-0 py-4 mx-auto page-container sm:!px-0 lg:!px-0 2xl:!px-0 md:!px-0 pdp-related-product-list slider-btn-css scroll-mt-32" id="usedSection">
          <div className='flex justify-between w-full gap-4 mb-3 sm:mb-4'>
            <span className='text-sm font-semibold text-black'>Showing {filteredProducts?.length} of {usedProducts?.Used?.length}</span>
            <div className='flex items-center justify-end gap-4'>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-0 rounded  ${view === 'grid'
                    ? ' text-sky-600 '
                    : 'bg-white text-gray-600 '
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setView('list')}
                  className={`p-0 rounded  ${view === 'list'
                    ? 'text-sky-600 '
                    : 'bg-white text-gray-600 '
                    }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
              {featureToggle?.features?.enableCompare &&
                <div>
                  <div className="flex items-center justify-end w-full px-0 pt-0 mx-auto sm:pt-1 sm:px-4">
                    <div className="flex flex-col py-0 pr-1 text-xs font-normal text-black font-14 whitespace-nowrap dark:text-black">
                      {translate('label.product.compareItemsText')}
                    </div>
                    <div className="flow-root w-10 px-2 sm:w-14">
                      <div className="flex justify-center flex-1 mx-auto">
                        <Switch checked={enabled} onChange={handleChange} className={`${enabled ? 'bg-switch-enable border-emerald-500' : 'bg-gray-300 border-slate-300'} relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
                          <span className="sr-only">{translate('label.product.compareItemsText')}</span>
                          <span aria-hidden="true" className={`${enabled ? 'translate-x-4 bg-white' : 'translate-x-0 bg-black'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`} />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className={`grid ${view === 'list' ? ' grid-cols-1 gap-4 sm:grid-cols-1' : ' grid-cols-1 gap-4 sm:grid-cols-5'}`}>
            {filteredProducts?.map((product: any, pId: number) => (
              <UsedProductCard
                key={product?.stockCode || pId}
                view={view}
                data={product}
                deviceInfo={deviceInfo}
                maxBasketItemsCount={maxBasketItemsCount}
                featureToggle={featureToggle}
                defaultDisplayMembership={defaultDisplayMembership}
              />
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <main className="mt-2 container-pdp sm:mt-5 lg:mt-11 dark:bg-white">
        <div className='flex flex-1 px-4 mb-1 sm:px-0 sm:mb-4 '>
          <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:pb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0 dark:bg-white" >
            <li className='flex items-center text-10-mob sm:text-sm'>
              <Link href={'/'} passHref>
                <span className="font-medium hover:text-gray-900 dark:text-slate-500 text-slate-700">Home</span>
              </Link>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black">
                <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
              </span>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <Link href={'/used'} passHref>
                <span className="font-medium hover:text-gray-900 dark:text-slate-500 text-slate-700" >Used</span>
              </Link>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black">
                <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
              </span>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <span className="font-semibold text-black hover:text-gray-900 dark:text-black">{product?.name}</span>
            </li>
          </ol>
        </div>
        <div className='grid grid-cols-12 gap-4 mb-4'>
          <div className='grid items-start grid-cols-12 col-span-8 gap-4'>
            <div className='col-span-3'>
              <img src={product?.image} className='object-contain w-[90%] h-auto' alt={product?.name} />
            </div>
            <div className='flex flex-col col-span-9 gap-1'>
              <h1 className="text-xl font-semibold heading sm:text-2xl product-name-h2 dark:text-black">{product?.name}</h1>
              {product?.condition != 'pre-launch' && <div className="flex flex-col gap-3">
                <ReviewBadge reviewCountdata={product?.reviewCount} ratingdata={product?.rating} />
              </div>}
              <div dangerouslySetInnerHTML={{ __html: product.shortDescription, }} className="hidden my-2 text-sm font-medium text-gray-900 sm:block product-detail-description" />
            </div>
          </div>
          <div className='flex flex-col col-span-4 gap-2'>
            {conditions?.map((item, idx) => {
              const isAvailable = item.available > 0;
              const isActive = conditionFilter === item.label;

              return (
                <div
                  key={idx}
                  onClick={() => isAvailable && toggleConditionFilter(item.label)}
                  className={`flex justify-between w-full py-0.5 px-3 text-xs rounded font-semibold border transition
                    ${isAvailable
                      ? isActive
                        ? 'border-sky-600 text-sky-700 bg-sky-100'
                        : 'text-black border-gray-500 hover:border-sky-600 cursor-pointer'
                      : 'text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                >
                  <span className='flex w-4/12 capitalize'>{item.label}</span>
                  <span className='flex w-4/12 text-left'>
                    {isAvailable ? `${item.available} available` : 'Not Available'}
                  </span>
                  <span className='flex justify-end w-4/12'>
                    {isAvailable && item.price ? `from £${item.price.toFixed(2)}` : ''}
                  </span>
                </div>
              );
            })}
            <Link href={sanitizeRelativeUrl(`/${product?.slug || product?.link}`)} className='flex justify-between w-full py-0.5 px-3 text-xs rounded font-semibold border text-black border-gray-500 hover:border-sky-600 cursor-pointer'>
              <span className='flex w-4/12 capitalize'>Brand New</span>
              <span className='flex justify-end w-4/12'>
                {product?.price?.formatted?.withTax}
              </span>
            </Link>
            <div className='flex flex-col gap-4 mt-3'>
              <h5 className='text-sm font-semibold text-gray-900'>Original manufacturer packaging</h5>
              <div className='flex justify-start gap-1'>
                <button className='px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-200 border border-gray-500 rounded-md'>Included</button>
                <button className='px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-200 border border-gray-500 rounded-md'>Not included</button>
                <button className='px-2 py-1 text-xs font-semibold text-white border rounded-md bg-sky-700 border-sky-700'>Show all</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mb-4">
          <div className='flex items-center justify-start gap-2 mb-2'>
            <label htmlFor="price-filter" className="block text-sm font-semibold">Filters: </label>
            {priceFilter && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                Price: {priceRanges.find((r) => r.value === priceFilter)?.label}
                <button type="button" onClick={() => setPriceFilter("")} className="ml-2 text-gray-500 hover:text-red-600 focus:outline-none">
                  <XMarkIcon className='w-3 h-3' />
                </button>
              </span>
            )}
            {conditionFilter && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                Condition: {conditionFilter}
                <button type="button" onClick={() => setConditionFilter("")} className="ml-2 text-gray-500 hover:text-red-600 focus:outline-none">
                  <XMarkIcon className='w-3 h-3' />
                </button>
              </span>
            )}
          </div>
          <div className='flex justify-start w-full gap-4'>
            <select id="price-filter" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="w-48 px-3 py-1 text-sm font-semibold text-black border rounded-md border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <select
              id="condition-filter"
              value={conditionFilter}
              onChange={(e) => toggleConditionFilter(e.target.value)}
              className="w-48 px-3 py-1 text-sm font-semibold text-black border rounded-md border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">All Conditions</option>
              {conditions.map((cond) => (
                <option key={cond.label} value={cond.label}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {featureToggle.features?.enableForPCSite && usedProducts?.Used?.length > 0 && renderUsedRelatedSection()}
        <CompareSelectionBar name={product?.name} showCompareProducts={showCompareProducts} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
      </main>
    </>
  )
}
