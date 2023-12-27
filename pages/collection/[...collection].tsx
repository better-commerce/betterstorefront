import dynamic from 'next/dynamic'
import Link from 'next/link'
import Script from 'next/script'
import NextHead from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import os from 'os'
import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
import { useReducer, useEffect, useState } from 'react'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import 'swiper/css'
import 'swiper/css/navigation'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { recordGA4Event } from '@components/services/analytics/ga4'
import {
  maxBasketItemsCount,
  notFoundRedirect,
  obfuscateHostName,
  setPageScroll,
} from '@framework/utils/app-util'
import { LoadingDots } from '@components/ui'
import { IPLPFilterState, useUI } from '@components/ui/context'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_60_SECONDS } from '@framework/utils/constants'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
const CompareSelectionBar = dynamic(
  () => import('@components/product/ProductCompare/compareSelectionBar')
)
const ProductFilterRight = dynamic(
  () => import('@components/product/Filters/filtersRight')
)
const ProductMobileFilters = dynamic(
  () => import('@components/product/Filters')
)
const ProductFiltersTopBar = dynamic(
  () => import('@components/product/Filters/FilterTopBar')
)
const ProductGridWithFacet = dynamic(() => import('@components/product/Grid'))
const ProductGrid = dynamic(
  () => import('@components/product/Grid/ProductGrid')
)
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const PLPFilterSidebar = dynamic(
  () => import('@components/product/Filters/PLPFilterSidebarView')
)
declare const window: any
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

export default function CollectionPage(props: any) {
  const { deviceInfo, config } = props
  const { isOnlyMobile, isMobile, isIPadorTablet } = deviceInfo
  const router = useRouter()
  const [paddingTop, setPaddingTop] = useState('0')
  const [isProductCompare, setProductCompare] = useState(false)
  const adaptedQuery: any = { ...router.query }
  const [plpFilterState, setPLPFilterState] = useState<IPLPFilterState>({
    filters: [],
    sortBy: '',
    sortList: [],
    results: 0,
    total: 0,
    currentPage: 0,
    pages: 0,
    loading: false,
  })
  const { isCompared } = useUI()

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    filters: adaptedQuery.filters || [],
    collectionId: props?.id,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    data: collection,
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
        collectionId: props?.id,
        sortBy: null,
      },
    },
    error,
  } = useSwr(
    ['/api/catalog/products', { ...state, ...{ slug: props?.slug } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  const [swrLoading, setSwrLoading] = useState(!error && !collection)

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [], // current page result set
      sortList: [],
      pages: 0, // total number of pages
      total: 0, // total numer of records
      currentPage: 1, // current page
      filters: [],
      collectionId: props?.id,
      sortBy: null,
    },
  })

  const [productDataToPass, setProductDataToPass] = useState(props?.products)

  useEffect(() => {
    if (productDataToPass) {
      setPLPFilterState({
        ...plpFilterState,
        filters: productDataToPass?.filters || [],
        sortBy: productDataToPass?.sortBy || '',
        sortList: productDataToPass?.sortList || [],
        results: productDataToPass?.results?.length || 0, // products length
        total: productDataToPass?.total || 0,
        currentPage: productDataToPass?.currentPage || 0,
        pages: productDataToPass?.pages || 0,
      })
    }
  }, [productDataToPass])

  useEffect(() => {
    const loadingState = !error && !collection
    setPLPFilterState({
      ...plpFilterState,
      loading: loadingState,
    })
    setSwrLoading(loadingState)
  }, [error, collection])

  useEffect(() => {
    if (productDataToPass?.results?.length > 0) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'view_item_list', {
          ecommerce: {
            items: productDataToPass?.results?.map(
              (item: any, itemId: number) => ({
                item_name: item?.name,
                item_id: item?.sku,
                price: item?.price?.raw?.withTax,
                item_brand: item?.brand,
                item_category1: item?.classification?.mainCategoryName,
                item_category2: item?.classification?.category,
                item_variant: item?.variantGroupCode,
                item_list_name: props?.name,
                item_list_id: props?.id,
                index: itemId + 1,
                item_var_id: item?.stockCode,
              })
            ),
          },
        })
      }
    }
  }, [productDataToPass])

  useEffect(() => {
    const dataToPass = IS_INFINITE_SCROLL
      ? productListMemory?.products
      : data?.products // productListMemory?.products
    if (dataToPass.results.length > 0) {
      setProductDataToPass(dataToPass)
    }
  }, [productListMemory?.products, data?.products])

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data?.products?.currentPage !== productListMemory.products.currentPage ||
      data?.products?.total !== productListMemory.products.total ||
      data?.products?.sortBy !== productListMemory.products.sortBy
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone: any = { ...data }
        if (state.currentPage > 1 && IS_INFINITE_SCROLL) {
          dataClone.products.results = [
            ...prevData.products.results,
            ...dataClone.products.results,
          ]
        }
        return dataClone
      })
    }
    //}
  }, [data?.products?.results?.length, data])

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
    if (typeof window !== 'undefined') {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  const handleInfiniteScroll = () => {
    if (
      data.products.pages &&
      data.products.currentPage < data.products.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const handleFilters = (filter: null, type: string) => {
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
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
  const clearAll = () => dispatch({ type: CLEAR })
  const css = { maxWidth: '100%', height: 'auto' }

  const defaultYOffset = () => {
    if (typeof window !== 'undefined') {
      return window.pageYOffset
    }
    return 0
  }

  const [position, setPosition] = useState(defaultYOffset())

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        let moving = window.pageYOffset

        setVisible(position > moving)
        setPosition(moving)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
    }
        
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

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

  }, [])

  const [visible, setVisible] = useState(true)
  const [appliedFilters, setAppliedFilters] = useState<any[]>([])

  useEffect(() => {
    const currentFilters = data?.products?.filters?.reduce(
      (acc: any, obj: any) => {
        acc.forEach((item: any) => {
          if (item.Key === obj.key) {
            item['name'] = obj.name
            return item
          }
          return acc
        })
        return acc
      },
      [...state?.filters]
    )
    setAppliedFilters(currentFilters)
  }, [state?.filters, data?.products])

  const cls = visible
    ? 'sticky w-full mx-auto bg-white top-108 sm:container'
    : 'relative'
  const totalResults =
    appliedFilters?.length > 0
      ? data?.products?.total
      : props?.products?.total || data?.products?.results?.length
  const [openPLPSidebar, setOpenPLPSidebar] = useState(false)
  const handleTogglePLPSidebar = () => {
    setOpenPLPSidebar(!openPLPSidebar)
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }

  const showCompareProducts = () => {
    setProductCompare(true)
  }

  const closeCompareProducts = () => {
    setProductCompare(false)
  }

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{props?.metaTitle || props?.name}</title>
        <meta name="title" content={props?.metaTitle || props?.name} />
        <meta name="description" content={props?.metaDescription} />
        <meta name="keywords" content={props?.metaKeywords} />

        <meta property="og:image" content="" />
        <meta property="og:title" content={props?.metaTitle || props?.name} key="ogtitle" />
        <meta
          property="og:description"
          content={props?.metaDescription}
          key="ogdesc"
        />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta
          property="og:url"
          content={absPath || SITE_ORIGIN_URL + router.asPath}
          key="ogurl"
        />
      </NextHead>
      {props?.hostName && (
        <input className="inst" type="hidden" value={props?.hostName} />
      )}
      <div className="pt-6 pb-24 mx-auto bg-transparent 2xl:w-4/5 sm:px-0">
        {props?.breadCrumbs && (
          <BreadCrumbs items={props?.breadCrumbs} currentProduct={props} />
        )}

        {props?.customInfo3 == 'vertical' && (
          <>
            <div className="container flex items-center justify-center w-full px-0 mx-auto mt-0 lg:px-4 sm:px-4 2xl:sm:px-0 sm:mt-4">
              {props?.images?.length > 1 ? (
                <>
                  <div className="w-full v-image-space">
                    {props?.images?.map((img: any, idx: number) => {
                      const imgUrl =
                        (isOnlyMobile ? img?.mobileUrl : img?.url) || img?.url
                      return (
                        <div key={`property-images-${idx}`}>
                          <div className="relative w-full h-auto px-0 collection-multi-vimage">
                            <Link
                              legacyBehavior
                              href={img?.link || '#'}
                              passHref
                            >
                              <span style={{ paddingTop }} className="block">
                                <img
                                  src={
                                    generateUri(imgUrl, 'h=1600&fm=webp&q=50') ||
                                    IMG_PLACEHOLDER
                                  }
                                  alt="Collection Banner"
                                  className="object-contain"
                                  onLoad={({ target }) => {
                                    const { naturalWidth, naturalHeight } =
                                      target as HTMLImageElement
                                    setPaddingTop(
                                      `calc(100% / (${naturalWidth} / ${naturalHeight})`
                                    )
                                  }}
                                />
                              </span>
                            </Link>
                            <div className="absolute z-10 text-left bottom-3 left-4">
                              <p className="font-medium text-white text-14">
                                {img?.title}
                              </p>
                              <p className="mb-2 font-normal text-left text-white text-10">
                                {img?.description}
                              </p>
                              {img?.title ? (
                                <>
                                  <Link
                                    legacyBehavior
                                    href={img?.link}
                                    passHref
                                  >
                                    <span className="font-medium text-left text-white underline text-12">
                                      Shop now
                                    </span>
                                  </Link>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  {props?.images?.map((img: any, idx: number) => {
                    const imgUrl =
                      (isOnlyMobile ? img?.mobileUrl : img?.url) || img?.url
                    return (
                      <div
                        className="w-full h-auto px-0"
                        key={`banner-image-${idx}`}
                      >
                        <Link legacyBehavior href={img?.link || '#'}>
                          <a>
                            <img src={imgUrl} width ={1920} height={460} alt="banner" />
                          </a>
                        </Link>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </>
        )}
        {props?.customInfo3 == 'Horizontal' ||
          (props?.customInfo3 == 'horizontal' && props?.images?.length > 0 && (
            <Swiper
              navigation={true}
              loop={true}
              className="flex items-center justify-center w-full mx-auto mt-0 mySwiper sm:px-0 sm:mt-0"
            >
              {props?.images?.map((img: any, idx: number) => (
                <SwiperSlide key={`horizontal-slider-${idx}`}>
                  <Link href={img.link || '#'}>
                    <img
                      style={css}
                      width={1920}
                      height={460}
                      src={
                        generateUri(img.url, 'h=500&fm=webp') || IMG_PLACEHOLDER
                      }
                      alt={props?.name || 'Collection Banner'}
                      className="object-cover object-center w-full h-48 cursor-pointer sm:h-96 sm:max-h-96"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ))}

        <div
          className={`sticky w-full py-4 mx-auto bg-white top-108 px-4 sm:px-4 2xl:px-0 sm:py-4 ${cls}`}
        >
          <h1 className="inline-block capitalize text-primary dark:text-black">
            {props?.name}
          </h1>
          <span className="pl-2 mt-0 text-xs font-semibold text-black text-14 sm:h-6 dark:text-black">
            {swrLoading ? <LoadingDots /> : `${totalResults ?? 0} results`}
          </span>
          <h2>{props?.description}</h2>
        </div>

        {productDataToPass?.results?.length > 0 && (
          <div className="grid grid-cols-1 gap-1 overflow-hidden lg:grid-cols-12 md:grid-cols-3 sm:grid-cols-3">
            {props?.allowFacets ? (
              <>
                {isMobile ? (
                  <ProductMobileFilters
                    handleFilters={handleFilters}
                    products={data.products}
                    routerFilters={state.filters}
                    handleSortBy={handleSortBy}
                    clearAll={clearAll}
                    routerSortOption={state.sortBy}
                  />
                ) : (
                  <ProductFilterRight
                    handleFilters={handleFilters}
                    products={data.products}
                    routerFilters={state.filters}
                  />
                )}
                <div className="sm:col-span-10 p-[1px]">
                  {isMobile ? null : (
                    <ProductFiltersTopBar
                      products={data.products}
                      handleSortBy={handleSortBy}
                      routerFilters={state.filters}
                      clearAll={clearAll}
                      routerSortOption={state.sortBy}
                    />
                  )}
                  <ProductGridWithFacet
                    products={productDataToPass}
                    currentPage={state?.currentPage}
                    handlePageChange={handlePageChange}
                    handleInfiniteScroll={handleInfiniteScroll}
                    deviceInfo={deviceInfo}
                    maxBasketItemsCount={maxBasketItemsCount(config)}
                    isCompared={isCompared}
                  />
                </div>
              </>
            ) : (
              <div className="col-span-12">
                <ProductFiltersTopBar
                  products={data.products}
                  handleSortBy={handleSortBy}
                  routerFilters={state.filters}
                  clearAll={clearAll}
                  routerSortOption={state.sortBy}
                />
                <ProductGrid
                  products={productDataToPass}
                  currentPage={state?.currentPage}
                  handlePageChange={handlePageChange}
                  handleInfiniteScroll={handleInfiniteScroll}
                  deviceInfo={deviceInfo}
                  maxBasketItemsCount={maxBasketItemsCount(config)}
                  isCompared={isCompared}
                />
              </div>
            )}
          </div>
        )}
        {props?.products?.total == 0 && (
          <div className="w-full py-32 mx-auto text-center">
            <h3 className="py-3 text-3xl font-semibold text-gray-200">
              {' '}
              No Item Availabe in {props?.name} Collection!
            </h3>
            <Link href="/collection" passHref>
              <span className="text-lg font-semibold text-indigo-500">
                <ChevronLeftIcon className="relative top-0 inline-block w-4 h-4"></ChevronLeftIcon>{' '}
                Back to collections
              </span>
            </Link>
          </div>
        )}

        <PLPFilterSidebar
          handleSortBy={handleSortBy}
          openSidebar={openPLPSidebar}
          handleTogglePLPSidebar={handleTogglePLPSidebar}
          plpFilterState={plpFilterState}
        />

        <CompareSelectionBar
          name={props?.name}
          showCompareProducts={showCompareProducts}
          isCompare={isProductCompare}
          maxBasketItemsCount={maxBasketItemsCount(config)}
          closeCompareProducts={closeCompareProducts}
          deviceInfo={deviceInfo}
        />

        {data?.products?.results?.length > 0 && (
          <Script
            type="application/ld+json"
            id="schema"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              {
                "@context": "https://schema.org/",
                "@type": "ItemList",
                "itemListElement": ${JSON.stringify(
                  data?.products?.results?.map((product: any, pId: number) => ({
                    '@type': 'ListItem',
                    position: pId + 1,
                    name: product?.name,
                    url: `${SITE_ORIGIN_URL}/${product?.slug}`,
                  }))
                )}
              }
            `,
            }}
          />
        )}
      </div>
    </>
  )
}

CollectionPage.Layout = Layout

export async function getStaticProps({ params, ...context }: any) {
  const slug: any = params!.collection
  const data = await getCollectionBySlug(slug[0])

  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const hostName = os.hostname()

  if (data?.status === "NotFound") {
    return notFoundRedirect()
  }

  return {
    props: {
      ...data,
      query: context,
      slug: params!.collection[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: data?.snippets ?? [],
      hostName: obfuscateHostName(hostName),
    },
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_60_SECONDS
  }
}

export async function getStaticPaths() {
  const data = await getCollections()
  return {
    paths: data
      .map((col: any) => {
        if (col.slug) {
          let collectionSlug =
            col.slug[0] === '/'
              ? `/collection${col.slug}`
              : `/collection/${col.slug}`
          return collectionSlug
        }
      })
      .filter((i: any) => !!i),
    fallback: 'blocking',
  }
}
