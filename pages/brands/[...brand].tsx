import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Link from 'next/link'
import useSwr from 'swr'
import commerce from '@lib/api/commerce'
import { useReducer, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { postData } from '@components/utils/clientFetcher'
import { maxBasketItemsCount, notFoundRedirect, setPageScroll } from '@framework/utils/app-util'
import { EmptyObject, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { BTN_RECOMMENDED_PROD, BTN_SEE_ALL, FEATURES_HEADING, IMG_PLACEHOLDER, RESULTS, SHOP_NOW } from '@components/utils/textVariables'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { tryParseJson } from '@framework/utils/parse-util'
import { PlainText, Video } from '@components/brand'
import getCollectionById from '@framework/api/content/getCollectionById'
import getBrandBySlug from '@framework/api/endpoints/catalog/getBrandBySlug'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import ImageCollection from '@components/brand/ImageCollection'
// const MultiBrandVideo = dynamic(
//   () => import('@components/brand/MultiBrandVideo')
// )
import OutOfStockFilter from '@components/product/Filters/OutOfStockFilter'
import faq from '@components/brand/faqData.json'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/css'
import CompareSelectionBar from '@components/product/ProductCompare/compareSelectionBar'
import { useUI } from '@components/ui'
import { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getAllBrandsStaticPath from '@framework/brand/get-all-brands-static-path'
import { sanitizeHtmlContent } from 'framework/utils/app-util'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'

const RecommendedProductCollection = dynamic(() => import('@components/brand/RecommendedProductCollection'))
const OfferCard = dynamic(() => import('@components/brand/OfferCard'))
const ProductSort = dynamic(() => import('@components/product/ProductSort'))
const ProductGrid = dynamic(() => import('@components/product/Grid/ProductGrid'))
const Slider = dynamic(() => import('@components/brand/Slider'))
const Disclosure = dynamic(() => import('@components/brand/Disclosure'))

export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
}

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
}

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  ADD_FILTERS,
  REMOVE_FILTERS,
} = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
}

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload, currentPage: 1 }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, currentPage: 1, filters: [] }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case REMOVE_FILTERS:
      return {
        ...state,
        filters: state.filters.filter(
          (item: any) => item.Value !== payload.Value
        ),
      }
    default:
      return { ...state }
  }
}

function BrandDetailPage({
  query,
  setEntities,
  recordEvent,
  brandDetails,
  slug,
  deviceInfo,
  config,
  collections, // ...for Attribute Collection api response
}: any) {
  const adaptedQuery = { ...query }
  const { BrandViewed, PageViewed } = EVENTS_MAP.EVENT_TYPES
  const { isMobile, isOnlyMobile } = deviceInfo
  let imageBannerCollectionResponse: any =
    collections.imageBannerCollectionResponse
  let imageCategoryCollectionResponse: any =
    collections.imageCategoryCollection
  let imgFeatureCollection: any = collections.imgFeatureCollection
  let offerBannerResult: any = collections.offerBannerResult
  let productCollectionRes: any = collections.productCollection

  useAnalytics(BrandViewed, {
    entity: JSON.stringify({
      id: brandDetails?.id,
      name: brandDetails?.name || '',
      manufName: brandDetails?.manufacturerName,
    }),
    entityName: PAGE_TYPE,
    pageTitle: brandDetails?.manufacturerName,
    entityType: 'Brand',
    eventType: 'BrandViewed',
  })

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    ...{
      filters: [
        {
          Key: 'brandNoAnlz',
          Value: brandDetails?.name,
          IsSelected: true,
        },
      ],
    },
  }

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      sortBy: null,
    },
  })

  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [manufacturerStateVideoName, setManufacturerStateVideoName] =
    useState('')
  const [manufacturerStateVideoHeading, setManufacturerStateVideoHeading] =
    useState('')
  const [
    manufacturerSettingTypeImgBanner,
    setManufacturerSettingTypeImgBanner,
  ] = useState(IMG_PLACEHOLDER)
  const [manufImgBannerLink, setManufImgBannerLink] = useState('')
  const [manufacturerImgBannerHeading, setManufacturerImgBannerHeading] =
    useState('')
  const [
    manufacturerStateMultiBrandVidNames,
    setManufacturerStateMultiBrandVidNames,
  ] = useState('')
  const [multiBrandVidHeading, setMultiBrandVidHeading] = useState('')
  const [manufacturerStateTextName, setManufacturerStateTextName] = useState('')
  const [manufacturerStateTextHeading, setManufacturerStateTextHeading] =
    useState('')
  const [textNames, setTextNames] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [showLandingPage, setShowLandingPage] = useState(true)
  const [isProductCompare, setProductCompare] = useState(false)
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
      },
    },
    error,
  } = useSwr(
    ['/api/catalog/products', { ...state, ...{ slug: slug, excludeOOSProduct } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data?.products?.currentPage !==
      productListMemory?.products?.currentPage ||
      data?.products?.total !== productListMemory?.products?.total ||
      data?.products?.sortBy !== productListMemory?.products?.sortBy
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone = { ...data }
        if (state.currentPage > 1 && IS_INFINITE_SCROLL) {
          dataClone.products.results = [
            ...prevData?.products?.results,
            ...dataClone?.products?.results,
          ]
        }
        return dataClone
      })
    }
    //}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.products?.results?.length, data])

  const handleClick = () => {
    setShowLandingPage(false)
    window.scrollTo(0, 0)
  }

  const handlePageChange = (page: any, redirect = true) => {
    if (redirect) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, currentPage: page.selected + 1 },
        },
        undefined,
        { shallow: true }
      )
    }
    dispatch({ type: PAGE, payload: page.selected + 1 })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleInfiniteScroll = () => {
    if (
      data?.products?.pages &&
      data?.products?.currentPage < data?.products?.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const clearAll = () => {
    dispatch({ type: CLEAR })
    dispatch({ type: ADD_FILTERS, payload: { Key: 'brandNoAnlz', Value: brandDetails?.name, IsSelected: true, }, })
  }


  const handleSortBy = (payload: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: payload },
    })
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  useEffect(() => {
    const entity = {
      allowFacet: true,
      brand: null,
      brandId: null,
      breadCrumb: null,
      category: null,
      categoryId: null,
      categoryIds: null,
      collection: null,
      collectionId: null,
      currentPage: state.currentPage,
      excludedBrandIds: null,
      excludedCategoryIds: null,
      facet: null,
      facetOnly: false,
      filters: state.filters,
      freeText: '',
      gender: null,
      ignoreDisplayInSearch: false,
      includeExcludedBrand: false,
      page: state.currentPage,
      pageSize: 0,
      promoCode: null,
      resultCount: data?.products?.total,
      sortBy: state?.sortBy,
      sortOrder: state?.sortOrder,
    }
    setEntities({
      [KEYS_MAP.entityId]: '',
      [KEYS_MAP.entityName]: '',
      [KEYS_MAP.entityType]: 'Search',
      [KEYS_MAP.entity]: JSON.stringify(entity),
    })

    recordEvent(EVENTS.FreeText)

    const trackScroll = (ev: any) => {
      setPageScroll(window?.location, ev.currentTarget.scrollX, ev.currentTarget.scrollY)
    }

    const isScrollEnabled = SCROLLABLE_LOCATIONS.find((x: string) => location.pathname.startsWith(x))
    if (isScrollEnabled) {
      window?.addEventListener('scroll', trackScroll)
      return () => {
        window?.removeEventListener('scroll', trackScroll)
      }
    } /*else {
      resetPageScroll()
    }*/

  }, [])

  useEffect(() => {
    const Widgets = JSON.parse(brandDetails?.widgetsConfig || '[]')
    Widgets.map((val: any) => {
      if (val.manufacturerSettingType == 'Video' && val.code == 'BrandVideo') {
        setManufacturerStateVideoHeading(val.heading)
        setManufacturerStateVideoName(val.name)
      } else if (
        val.manufacturerSettingType == 'ImageBanner' &&
        val.code == 'MidBannerKitBuilder'
      ) {
        setManufacturerSettingTypeImgBanner(val.name)
        setManufacturerImgBannerHeading(val.heading)
        setManufImgBannerLink(val.buttonLink)
      } else if (
        val.manufacturerSettingType == 'Video' &&
        val.code === 'MultipleBrandVideos'
      ) {
        setManufacturerStateMultiBrandVidNames(val.name)
        setMultiBrandVidHeading(val.heading)
      } else if (
        val.manufacturerSettingType == 'PlainText' &&
        val.code == 'BrandInnovations'
      ) {
        setManufacturerStateTextHeading(val.heading)
        setManufacturerStateTextName(val.name)
        if (val.name) {
          const TextNames = val.name.split('  ')
          setTextNames(TextNames)
        }
      }
      return
    })
  }, [])

  //const productDataToPass = productListMemory.products
  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : data?.products

  useEffect(() => {
    if (productDataToPass?.results?.length > 0) {
      setRecommendedProducts(productDataToPass.results.slice(0, 8))
    }
  }, [productDataToPass])

  const showCompareProducts = () => {
    setProductCompare(true)
  }

  const closeCompareProducts = () => {
    setProductCompare(false)
  }
  const { isCompared } = useUI()
  // IMPLEMENT HANDLING FOR NULL OBJECT
  if (brandDetails === null) {
    return (
      <div className="container relative py-10 mx-auto text-center top-20">
        <h1 className="pb-6 text-3xl font-medium text-gray-400 font-30">
          This is a bad url. please go back to
          <Link href="/brands">
            <span className="px-3 text-indigo-500">All brands</span>
          </Link>
        </h1>
      </div>
    )
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }

  const sanitizedDescription = sanitizeHtmlContent(brandDetails?.description)

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{brandDetails?.metaTitle || brandDetails?.name}</title>
        <meta name="title" content={brandDetails?.metaTitle || brandDetails?.name} />
        <meta name="title" content={brandDetails?.name || 'Brands'} />
        <meta name="description" content={brandDetails?.metaDescription} />
        <meta name="keywords" content={brandDetails?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={brandDetails?.metaTitle || brandDetails?.name} key="ogtitle" />
        <meta property="og:description" content={brandDetails?.metaDescription} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      {brandDetails?.showLandingPage && showLandingPage ? (
        <>
          <div className="w-full px-4 pb-0 mx-auto bg-white md:pb-20 2xl:w-4/5 lg:px-0 sm:px-10">
            <div className="grid grid-cols-1 gap-5 mt-20 md:grid-cols-2">
              <div className="flex flex-col items-center px-4 sm:px-10 py-4 sm:py-10 bg-[#FEBD18] min-h-[350px] md:min-h-[85vh] lg:min-h-[55vh] justify-evenly pt-2">
                <img alt="Brand Logo" src={brandDetails.premiumBrandLogo || IMG_PLACEHOLDER} width={212} height={200} loading="eager" className="w-[120px] md:w-[212px] h-auto" />
                <div dangerouslySetInnerHTML={{ __html: brandDetails?.shortDescription, }} className="text-2xl font-semibold uppercase w-3/4 text-[#212530] text-center leading-10 py-5" />
                <button className="px-6 py-3 font-semibold text-white uppercase bg-black rounded-md hover:opacity-80" onClick={handleClick} > {SHOP_NOW} </button>
              </div>
              <ImageCollection range={2} AttrArray={imageCategoryCollectionResponse || []} showTitle={true} />
            </div>
            <div className="mt-0 md:mt-10">
              <Video heading={manufacturerStateVideoHeading} name={manufacturerStateVideoName} />
            </div>
            <div className="mt-10">
              <Slider images={imageCategoryCollectionResponse || []} isBanner={true} />
            </div>
            <div className="mt-10">
              <div className="flex flex-col gap-4 sm:px-4">
                <div className="flex flex-row justify-between">
                  <p className="font-semibold text-[#212530] uppercase cursor-default font-lg"> {BTN_RECOMMENDED_PROD} </p>
                  <button className="font-semibold uppercase text-[#212530] cursor-pointer font-lg hover:underline" onClick={handleClick} > {BTN_SEE_ALL} </button>
                </div>
                <RecommendedProductCollection recommendedProducts={productCollectionRes} deviceInfo={deviceInfo} config={config} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 my-10 md:grid-cols-2">
              {offerBannerResult?.map((val: any, Idx: number) => (
                <OfferCard key={Idx} index={Idx} title={val.title} description={val.description} src={val.url} link={val.link} buttonText={val.buttonText} />
              ))}
            </div>
          </div>

          <div className="w-full px-4 pb-20 mx-auto md:w-4/5 lg:px-0 sm:px-10">
            <div className="flex justify-between pb-10 mt-4">
              <p className="font-semibold text-[#212530] uppercase cursor-default font-lg"> {FEATURES_HEADING} {` `} {brandDetails.name} </p>
              {!isOnlyMobile && (
                <button className="font-semibold text-[#212530] uppercase cursor-pointer font-lg md:block hover:underline" onClick={handleClick} > {BTN_SEE_ALL} </button>
              )}
            </div>
            {isOnlyMobile ? (
              <div className="mb-10 max-h-[30vh]">
                <Slider images={imgFeatureCollection?.images || []} isBanner={false} />
              </div>
            ) : (
              <div className="mb-10">
                <ImageCollection range={4} AttrArray={imgFeatureCollection?.images || []} />
              </div>
            )}
            <PlainText textNames={textNames || []} heading={manufacturerStateTextHeading} />
            <div className="mb-20">
              <p className="my-10 font-semibold text-[#212530] uppercase cursor-default font-lg"> {faq.title} </p>
              {faq?.results?.map((val: any, Idx: number) => {
                return (
                  <Disclosure key={Idx} heading={val.faq} details={val.ans} />
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="pt-5 pb-0 mx-auto mt-4 bg-transparent 2xl:w-4/5 sm:mt-6 sm:px-6 md:px-6 2xl:px-0">
          <div className="px-3 py-3 text-left sm:py-1 sm:px-0">
            <Link href="/brands" passHref>
              <span className="flex items-end upper case">Brands</span>
            </Link>
            <div className="">
              <h1 className="inline-block text-black">{brandDetails?.name}</h1>
              <span className="inline-block ml-2 text-sm font-semibold text-black"> Showing {data?.products?.total} {RESULTS} </span>
            </div>
            {sanitizedDescription && (
              <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} className="mt-2 text-black sm:mt-5" />
            )}
          </div>
          <div className="flex justify-end w-full col-span-12">
            <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
          </div>
          <div className="flex justify-end w-full">
            <ProductSort routerSortOption={state.sortBy} products={data.products} action={handleSortBy} />
          </div>
          <ProductGrid products={productDataToPass} currentPage={state.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} />
          <CompareSelectionBar name={brandDetails?.name} showCompareProducts={showCompareProducts} products={productDataToPass} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
        </div>
      )}
    </>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ brand: string }>) {
  const slug = `brands/${params!?.brand[0]}`
  const cachedDataUID = {
    infraUID : Redis.Key.INFRA_CONFIG,
    brandSlugUID: Redis.Key.Brands.Slug + '_' + slug,
    collectionUID: Redis.Key.Brands.Collection + '_' + slug
  }
  const cachedData = await getDataByUID([
    cachedDataUID.infraUID,
    cachedDataUID.brandSlugUID,
    cachedDataUID.collectionUID,
  ])
  let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
  let brandBySlugUIDData: any = parseDataValue(cachedData, cachedDataUID.brandSlugUID)
  let collectionUIDData: any = parseDataValue(cachedData, cachedDataUID.collectionUID)

  if (!brandBySlugUIDData) {
    brandBySlugUIDData = await getBrandBySlug(slug, {})
    await setData([{ key: cachedDataUID.brandSlugUID, value: brandBySlugUIDData }])
  }
  
  if(!infraUIDData) {
    infraUIDData = await commerce.getInfra()
    await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
  }

    if (brandBySlugUIDData?.status === "NotFound") {
    return notFoundRedirect()
  }

  const collections: any = {
    imageBannerCollection: collectionUIDData?.imageBannerCollection || [],
    imageCategoryCollection: collectionUIDData?.imageCategoryCollection || [],
    imgFeatureCollection: collectionUIDData?.imgFeatureCollection || [],
    offerBannerCollection: collectionUIDData?.offerBannerCollection || [],
    productCollection: collectionUIDData?.productCollection || [],
  }

  try {
    let promises: any = []
    const widgets: any = tryParseJson(brandBySlugUIDData?.result?.widgetsConfig) || []
    if (widgets?.length) {
      widgets?.forEach(async (widget: any) => {
        if (
          widget.manufacturerSettingType == 'ImageCollection' &&
          widget.code == 'ImageBanner'
        ) {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                collections.imageBannerCollection = await getCollectionById(
                  widget.recordId
                )
              } catch (error: any) {}
              resolve()
            })
          )
        } else if (
          widget.manufacturerSettingType == 'ImageCollection' &&
          widget.code == 'MultipleImagesBanner'
        ) {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                const res = await getCollectionById(widget.recordId)
                collections.imageCategoryCollection = res?.images
              } catch (error: any) {}
              resolve()
            })
          )
        } else if (
          widget.manufacturerSettingType == 'ImageCollection' &&
          widget.code == 'FeaturedDewaltImageList'
        ) {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                collections.imgFeatureCollection = await getCollectionById(
                  widget.recordId
                )
              } catch (error: any) {}
              resolve()
            })
          )
        } else if (
          widget.manufacturerSettingType == 'ImageCollection' &&
          widget.code == 'FFXOffers'
        ) {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                const res = await getCollectionById(widget.recordId)
                collections.offerBannerCollection = res.images
              } catch (error: any) {}
              resolve()
            })
          )
        } else if (
          widget.manufacturerSettingType == 'ProductCollection' &&
          widget.code == 'FeaturedDewaltSaws'
        ) {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                const res = await getCollectionById(widget.recordId)
                collections.productCollection = res.products.results
              } catch (error: any) {}
              resolve()
            })
          )
        }
      })
    }

    if (promises?.length) {
      await Promise.all(promises)
      await setData([{ key: cachedDataUID.collectionUID, value: collections }])
    }
  } catch (error: any) {
    // return console.error(error)
  }
  return {
    props: {
      query: EmptyObject, //context.query,
      params: params,
      slug: slug,
      brandDetails: brandBySlugUIDData?.result ?? {},
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: brandBySlugUIDData?.snippets ?? [],
      collections,
    }, // will be passed to the page component as props
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const paths: Array<string> = await getAllBrandsStaticPath()
  return {
    paths: paths?.map((x: any) => !x?.slug?.startsWith('/') ? `/${x?.slug}` : x?.slug),
    fallback: 'blocking',
  }
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandDetailPage, PAGE_TYPE)
