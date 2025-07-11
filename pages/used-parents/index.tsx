import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NextHead from 'next/head'
import Layout from '@components/Layout/Layout'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, CURRENT_THEME, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { logError, maxBasketItemsCount } from '@framework/utils/app-util'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { AnalyticsEventType } from '@components/services/analytics'
import { serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import getAllUsed from '@framework/used/get-all-used'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { useUI } from '@components/ui'
import { routeToPLPWithSelectedFilters, setPLPFilterSelection } from 'framework/utils/app-util'
import useSWR from 'swr'
import { postData } from '@components/utils/clientFetcher'
import FilterHorizontal from '@components/Product/Filters/filterHorizontal'
const UsedProductGrid = dynamic(() => import('@components/Product/Grid/UsedProductGrid'))
export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  SET_FILTERS: 'SET_FILTERS',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
  SET_CATEGORY_ID: 'SET_CATEGORY_ID',
  RESET_STATE: 'RESET_STATE'
}

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  SET_FILTERS,
  ADD_FILTERS,
  REMOVE_FILTERS,
  SET_CATEGORY_ID,
  RESET_STATE
} = ACTION_TYPES
const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
  categoryId: '',
}
interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
  categoryId: any
}
export interface IPLPFilterState {
  filters: Array<any>
  sortBy: string
  sortList: Array<any>
  results: number
  total: number
  currentPage: number
  pages: number
  loading: boolean
}
interface actionInterface {
  type?: string
  payload?: object | any
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
    case SET_CATEGORY_ID:
      return { ...state, categoryId: payload }
    case SET_FILTERS:
      return { ...state, filters: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case RESET_STATE:
      return DEFAULT_STATE
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
function UsedPage(props: any) {
  const router = useRouter()
  const qsFilters = router.asPath
  const adaptedQuery: any = { ...router.query }
  const { deviceInfo, config, featureToggle, defaultDisplayMembership, } = props
  const { isCompared } = useUI()
  const [previousSlug, setPreviousSlug] = useState(router?.asPath?.split('?')[0])
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
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
  const initialState = {
    ...DEFAULT_STATE,
    // Setting initial filters from query string
    filters: props?.data?.filters ? props?.data?.filters : [],
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      const currentSlug = url?.split('?')[0];
      if (currentSlug !== previousSlug) {
        dispatch({ type: RESET_STATE })
        setPreviousSlug(currentSlug);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [previousSlug, router]);
  const translate = useTranslation()

  const {
    data: collection,
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: state?.filters || [],
        collectionId: props?.id,
        sortBy: null,
      },
    },
    error,
    isValidating
  } = useSWR(
    ['/api/catalog/products', { ...state, ...{ collectionId: props?.id, slug: props?.slug, excludeOOSProduct } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Dedupe identical requests within 5 seconds
      focusThrottleInterval: 10000, // Throttle revalidation on focus
      errorRetryCount: 3, // Retry failed requests 3 times
    }
  )

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      const currentSlug = url?.split('?')[0];
      if (currentSlug !== previousSlug) {
        dispatch({ type: RESET_STATE })
        setPreviousSlug(currentSlug);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [previousSlug, router]);

  const [swrLoading, setSwrLoading] = useState(!error && !collection)

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [], // current page result set
      sortList: [],
      pages: 0, // total number of pages
      total: 0, // total number of records
      currentPage: 1, // current page
      filters: [],
      collectionId: props?.id,
      sortBy: null,
    },
  })

  const [productDataToPass, setProductDataToPass] = useState(props?.products)


  useEffect(() => {
    if (state?.filters?.length) {
      routeToPLPWithSelectedFilters(router, state?.filters)
    }
    setPLPFilterSelection(state?.filters)
  }, [state?.filters])

  // Memoize the out of stock items handler
  const onEnableOutOfStockItems = useCallback((val: boolean) => {
    setExcludeOOSProduct(!val)
    // clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }, [])

  // Optimize filter state updates with memoization
  useEffect(() => {
    if (productDataToPass) {
      const newFilterState = {
        ...plpFilterState,
        filters: productDataToPass?.filters || [],
        sortBy: productDataToPass?.sortBy || '',
        sortList: productDataToPass?.sortList || [],
        results: productDataToPass?.results?.length || 0,
        total: productDataToPass?.total || 0,
        currentPage: productDataToPass?.currentPage || 0,
        pages: productDataToPass?.pages || 0,
      }

      // Only update if state has actually changed
      if (JSON.stringify(newFilterState) !== JSON.stringify(plpFilterState)) {
        setPLPFilterState(newFilterState)
      }
    }
  }, [productDataToPass, plpFilterState])

  // Optimize loading state updates
  useEffect(() => {
    const loadingState = !error && !collection
    if (plpFilterState.loading !== loadingState) {
      setPLPFilterState({
        ...plpFilterState,
        loading: loadingState,
      })
      setSwrLoading(loadingState)
    }
  }, [error, collection, plpFilterState])

  useEffect(() => {
    if (productDataToPass?.results?.length > 0) {
      if (typeof window !== 'undefined') {
        //debugger
        const extras = { originalLocation: SITE_ORIGIN_URL + router.asPath }
      }
    }
  }, [productDataToPass])

  // Optimize data processing with useMemo
  useEffect(() => {
    const dataToPass = IS_INFINITE_SCROLL ? productListMemory?.products : data?.products
    // Only update state if data has changed to prevent unnecessary re-renders
    if (JSON.stringify(dataToPass) !== JSON.stringify(productDataToPass)) {
      if (dataToPass?.results?.length > 0) {
        setProductDataToPass(dataToPass)
      } else {
        setProductDataToPass(null)
      }
    }
  }, [productListMemory?.products, data?.products, productDataToPass])

  // Memoize the filter setter - used in child components
  const setFilter = useCallback((filters: any) => {
    dispatch({ type: SET_FILTERS, payload: filters })
  }, [])
  // Memoize the filter removal handler
  const removeFilter = useCallback((key: string) => {
    if (props?.data?.filters?.length == 1) {
      routeToPLPWithSelectedFilters(router, [])
    }
    dispatch({ type: REMOVE_FILTERS, payload: key })
  }, [props?.data?.filters, router])

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data?.products?.currentPage !== productListMemory?.products?.currentPage ||
      data?.products?.total !== productListMemory?.products?.total ||
      data?.products?.sortBy !== productListMemory?.products?.sortBy
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone: any = { ...data }
        if (state?.currentPage > 1 && IS_INFINITE_SCROLL) {
          dataClone.products.results = [
            ...prevData?.products?.results,
            ...dataClone?.products?.results,
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
    if (props?.data.pages && props?.data.currentPage < props?.data.pages) {
      dispatch({ type: PAGE, payload: props?.data.currentPage + 1 })
    }
  }
  useAnalytics(AnalyticsEventType.USED_VIEWED, { used: null, entityName: PAGE_TYPE, entityType: EVENTS_MAP.ENTITY_TYPES.used, })
  const handleFilters = (filter: null, type: string) => {
    if (props?.data?.filters?.length == 1 && type == REMOVE_FILTERS) {
      routeToPLPWithSelectedFilters(router, [])
    }
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
  }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Used</title>
        <meta name="title" content="Used" />
        <meta name="description" content="Used" />
        <meta name="keywords" content="Used" />

        <meta property="og:image" content="" />
        <meta property="og:title" content="Used" key="ogtitle" />
        <meta property="og:description" content="Used" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      <div className='w-full dark:bg-white'>
        <main className="container w-full pt-6 mx-auto theme-account-container dark:bg-white">
          <section aria-labelledby="products-heading">
            <h1 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl dark:text-black">Used</h1>

            {/* Add Filters UI */}
            <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="category" />

            {/* Product Grid */}
            <div className='flex flex-col gap-4 py-6'>
              <UsedProductGrid
                isPagination={true}
                products={props?.data}
                currentPage={props?.data?.currentPage}
                handlePageChange={handlePageChange}
                handleInfiniteScroll={handleInfiniteScroll}
                deviceInfo={deviceInfo}
                maxBasketItemsCount={maxBasketItemsCount(config)}
                isCompared={isCompared}
                featureToggle={featureToggle}
                defaultDisplayMembership={defaultDisplayMembership}
              />
            </div>
          </section>
        </main>

      </div>
    </>
  )
}

UsedPage.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  let usedUIDData: any
  try {
    const usedUID = Redis.Key.Used.AllUsed + '_' + locale
    const cachedData = await getDataByUID([usedUID])
    usedUIDData = parseDataValue(cachedData, usedUID)
    if (!containsArrayData(usedUIDData)) {
      try {
        usedUIDData = await getAllUsed({ [Cookie.Key.LANGUAGE]: locale })
        if (containsArrayData(usedUIDData)) {
          await setData([{ key: usedUID, value: usedUIDData }])
        } else {
          return { notFound: true } // fallback for missing data
        }
      } catch (err) {
        logError(err)
        return { notFound: true }
      }
    }
  } catch (error: any) {
    logError(error)

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      let errorUrl = '/500'
      const errorData = error?.response?.data
      if (errorData?.errorId) {
        errorUrl = `${errorUrl}?errorId=${errorData.errorId}`
      }
      return {
        redirect: {
          destination: errorUrl,
          permanent: false,
        },
        revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
      }
    }
  }

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ cookies })

  return {
    props: {
      ...pageProps,
      data: usedUIDData,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Used

export default withDataLayer(UsedPage, PAGE_TYPE)