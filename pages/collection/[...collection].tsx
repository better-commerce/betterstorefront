import dynamic from 'next/dynamic'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import Script from 'next/script'
import os from 'os'

import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
//DYNAMINC COMPONENT CALLS
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
import { useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import Image from 'next/image'
import { postData } from '@components/utils/clientFetcher'
import { IMG_PLACEHOLDER, RESULTS } from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ChevronLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { obfuscateHostName } from '@framework/utils/app-util'
import { LoadingDots } from '@components/ui'
import PLPFilterSidebar from '@components/product/Filters/PLPFilterSidebarView'
import { IPLPFilterState } from '@components/ui/context'

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
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, filters: [] }
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
  const router = useRouter()
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

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    filters: adaptedQuery.filters || [],
    collectionId: props.id,
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
        collectionId: props.id,
      },
    },
    error,
  } = useSwr(['/api/catalog/products', state], postData)

  const [swrLoading, setSwrLoading] = useState(!error && !collection)

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      collectionId: props.id,
    },
  })
    
  const [productDataToPass, setProductDataToPass] = useState(props.products)
  
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
      loading: loadingState
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
    const data = IS_INFINITE_SCROLL ? productListMemory.products : props.products
    setProductDataToPass(data)
  }, [productListMemory.products, props.products])

  useEffect(() => {
    if (IS_INFINITE_SCROLL) {
      if (
        data.products.currentPage !== productListMemory.products.currentPage ||
        data.products.total !== productListMemory.products.total
      ) {
        setProductListMemory((prevData: any) => {
          let dataClone = { ...data }
          if (state.currentPage > 1) {
            dataClone.products.results = [
              ...prevData.products.results,
              ...dataClone.products.results,
            ]
          }
          return dataClone
        })
      }
    }
  }, [data.products.results.length])

  const handlePageChange = (page: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, currentPage: page.selected + 1 },
      },
      undefined,
      { shallow: true }
    )
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
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const [visible, setVisible] = useState(true)
  const [appliedFilters, setAppliedFilters] = useState<any[]>([])

  useEffect(() => {
    const currentFilters = props?.products?.filters?.reduce(
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
  }, [state?.filters, props?.products])

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

  return (
    <div>
      {props?.hostName && (
        <input className="inst" type="hidden" value={props?.hostName} />
      )}
      <main className="pb-0 mx-auto md:w-4/5">
        {props.breadCrumbs && (
          <div className="pt-2 sm:pt-4">
            <BreadCrumbs items={props.breadCrumbs} currentProduct={props} />
          </div>
        )}
        {props.images.length > 0 && (
          <div className="flex items-center justify-center w-full mx-auto mt-0 sm:px-0 sm:mt-4">
            <Swiper navigation={true} loop={true} className="mySwiper">
              {props.images.map((img: any, idx: number) => {
                return (
                  <SwiperSlide key={idx}>
                    <Link href={img.link || '#'}>
                      <Image
                        style={css}
                        width={1920}
                        height={460}
                        src={
                          generateUri(img.url, 'h=700&fm=webp') ||
                          IMG_PLACEHOLDER
                        }
                        alt={props.name}
                        className="object-cover object-center w-full h-48 cursor-pointer sm:h-96 sm:max-h-96"
                      ></Image>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}

        <div className={cls}>
          <div className="sticky w-full py-4 mx-auto bg-white top-108 sm:container sm:py-4">
            <div className="grid w-full grid-cols-1 sm:grid-cols-12">
              <div className="mt-1 mr-2 sm:col-span-6 product-side-filter">
                <div className="text-base capitalize text-primary dark:text-primary text-24">
                  <h1 className="inline-block text-base font-medium capitalize text-primary dark:text-primary text-24">
                    {props?.name}
                  </h1>
                  <span className="pl-2 mt-0 text-xs text-brown-light dark:text-brown-light text-14 sm:h-6">
                    {swrLoading ? (
                      <LoadingDots />
                    ) : (
                      `${totalResults ?? 0} results`
                    )}
                  </span>
                </div>
                <h2>{props?.description}</h2>
              </div>

              {/* Filter Sidebar CTA */}
              {/* <div className="hidden sm:col-span-6 product-card-list sm:block">
                <button
                  className="float-right flex items-center"
                  onClick={handleTogglePLPSidebar}
                >
                  <span className="w-auto h-4 mr-2 inline-block overflow-hidden">
                    <AdjustmentsHorizontalIcon className="inline-block w-6 h-8 relative -top-1" />
                  </span>
                  <span>Filter</span>
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {props.products.total > 0 && (
          <div className="grid grid-cols-1 gap-1 overflow-hidden sm:grid-cols-12">
            {props.allowFacets && (
              <>
                {/* {MOBILE FILTER PANEL SHOW ONLY IN MOBILE} */}

                <div className="flex flex-col sm:col-span-2 sm:hidden">
                  <ProductMobileFilters
                    handleFilters={handleFilters}
                    products={props.products}
                    routerFilters={state.filters}
                    handleSortBy={handleSortBy}
                    clearAll={clearAll}
                    routerSortOption={state.sortBy}
                  />
                </div>
                <div className="hidden sm:col-span-2 sm:block">
                  <ProductFilterRight
                    handleFilters={handleFilters}
                    products={props.products}
                    routerFilters={state.filters}
                  />
                </div>
                <div className="sm:col-span-10 p-[1px]">
                  {/* {HIDE FILTER TOP BAR IN MOBILE} */}

                  <div className="flex-1 hidden sm:block">
                    <ProductFiltersTopBar
                      products={data.products}
                      handleSortBy={handleSortBy}
                      routerFilters={state.filters}
                      clearAll={clearAll}
                      routerSortOption={state.sortBy}
                    />
                  </div>
                  <ProductGridWithFacet
                    products={productDataToPass}
                    currentPage={props.currentPage}
                    handlePageChange={handlePageChange}
                    handleInfiniteScroll={handleInfiniteScroll}
                  />
                </div>
              </>
            )}
            {!props.allowFacets && (
              <>
                <div className="col-span-12">
                  <ProductGrid
                    products={productDataToPass}
                    currentPage={props.currentPage}
                    handlePageChange={handlePageChange}
                    handleInfiniteScroll={handleInfiniteScroll}
                  />
                </div>
              </>
            )}
            <div></div>
          </div>
        )}
        {props.products.total == 0 && (
          <div className="w-full py-32 mx-auto text-center">
            <h3 className="py-3 text-3xl font-semibold text-gray-200">
              No Item Availabe in {props.name} Collection!
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

        {props?.products?.results?.length > 0 && (
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
                  props?.products?.results?.map(
                    (product: any, pId: number) => ({
                      '@type': 'ListItem',
                      position: pId + 1,
                      name: product?.name,
                      url: `${SITE_ORIGIN_URL}/${product?.slug}`,
                    })
                  )
                )}
              }
            `,
            }}
          />
        )}
      </main>
    </div>
  )
}

CollectionPage.Layout = Layout

export async function getStaticProps({ params, ...context }: any) {
  const slug: any = params!.collection
  const data = await getCollectionBySlug(slug[0])

  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const hostName = os.hostname()

  //console.log(context)
  return {
    props: {
      ...data,
      query: context,
      slug: params!.collection[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: data?.snippets,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: 60,
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
