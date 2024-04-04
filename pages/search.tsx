// Base Imports
import { useReducer, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import Script from 'next/script'
import NextHead from 'next/head'
import { GetServerSideProps } from 'next'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import commerce from '@lib/api/commerce'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { postData } from '@components/utils/clientFetcher'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useUI } from '@components/ui/context'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
const CompareSelectionBar = dynamic(() => import('@components/Product/ProductCompare/compareSelectionBar'))
const OutOfStockFilter = dynamic(() => import('@components/Product/Filters/OutOfStockFilter'))
const ProductGrid = dynamic(() => import('@components/Product/Grid'))
const ProductMobileFilters = dynamic(() => import('@components/Product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/Product/Filters/filtersRight'))
const ProductFiltersTopBar = dynamic(() => import('@components/Product/Filters/FilterTopBar'))
declare const window: any
export const ACTION_TYPES = { SORT_BY: 'SORT_BY', PAGE: 'PAGE', SORT_ORDER: 'SORT_ORDER', CLEAR: 'CLEAR', HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI', ADD_FILTERS: 'ADD_FILTERS', REMOVE_FILTERS: 'REMOVE_FILTERS', FREE_TEXT: 'FREE_TEXT', }
const IS_INFINITE_SCROLL = process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
const PAGE_TYPE = PAGE_TYPES['Search']
const { SORT_BY, PAGE, SORT_ORDER, CLEAR, HANDLE_FILTERS_UI, ADD_FILTERS, REMOVE_FILTERS, FREE_TEXT } = ACTION_TYPES
const DEFAULT_STATE = { sortBy: '', sortOrder: 'asc', currentPage: 1, filters: [], freeText: '' }
interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
  freeText: string
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
    case FREE_TEXT:
      return { ...state, freeText: payload || '' }
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

function Search({ query, setEntities, recordEvent, deviceInfo, config, featureToggle }: any) {
  const { isMobile, isOnlyMobile, isIPadorTablet } = deviceInfo
  const [isProductCompare, setProductCompare] = useState(false)
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
  const adaptedQuery = { ...query }
  const translate = useTranslation()
  adaptedQuery.currentPage ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage)) : false
  adaptedQuery.filters ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters)) : false

  const initialState = {
    ...DEFAULT_STATE,
    ...adaptedQuery,
  }

  const { user } = useUI()
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
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
        freeText: query.freeText || '',
      },
    },
    error,
  } = useSwr(
    ['/api/catalog/products', { ...state, excludeOOSProduct }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  const [isLoading, setIsLoading] = useState(true)
  const { CategoryViewed, FacetSearch } = EVENTS_MAP.EVENT_TYPES

  useEffect(() => {
    if (
      router.query.freeText !== undefined &&
      router.query.freeText !== state.freeText
    ) {
      dispatch({ type: FREE_TEXT, payload: query.freeText })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.freeText])

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }


  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data.products.currentPage !== productListMemory.products.currentPage ||
      data.products.total !== productListMemory.products.total ||
      data.products.sortBy !== productListMemory.products.sortBy
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone = { ...data }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const BrandFilter = state.filters.find(
    (filter: any) => filter.name === 'Brand'
  )
  const CategoryFilter = state.filters.find(
    (filter: any) => filter.name === 'Category'
  )

  useAnalytics(FacetSearch, {
    entity: JSON.stringify({
      FreeText: '',
      Page: state.currentPage,
      SortBy: state.sortBy,
      SortOrder: state.sortOrder,
      Brand: BrandFilter ? BrandFilter.value : null,
      Category: CategoryFilter ? CategoryFilter.value : null,
      Gender: user.gender,
      CurrentPage: state.currentPage,
      PageSize: 20,
      Filters: state.filters,
      AllowFacet: true,
      ResultCount: data.products.total,
    }),
    entityName: PAGE_TYPE,
    pageTitle: 'Catalog',
    entityType: 'Page',
    eventType: 'Search',
  })

  const handleInfiniteScroll = () => {
    if (
      data.products.pages &&
      data.products.currentPage < data.products.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const handleSortBy = (payload: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router?.query, sortBy: payload },
    })

    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  // useEffect(() => {
  //   router.push({
  //     pathname: router.pathname,
  //     query: {
  //       ...router.query,
  //       filters: JSON.stringify(state.filters),
  //     },
  //   })

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.filters])

  const removeFilter = (key: string) => {
    dispatch({ type: REMOVE_FILTERS, payload: key })
  }

  const handleFilters = (filter: null, type: string) => {
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
  }

  const clearAll = () => dispatch({ type: CLEAR })

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
      ignoreDisplayInSerach: false,
      includeExcludedBrand: false,
      page: state.currentPage,
      pageSize: 0,
      promoCode: null,
      resultCount: data.products.total,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    }
    setEntities({
      [KEYS_MAP.entityId]: '',
      [KEYS_MAP.entityName]: '',
      [KEYS_MAP.entityType]: 'Search',
      [KEYS_MAP.entity]: JSON.stringify(entity),
    })

    recordEvent(EVENTS.FreeText)
  })

  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory?.products
    : data?.products

  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const { isCompared } = useUI()
  const showCompareProducts = () => {
    setProductCompare(true)
  }

  const closeCompareProducts = () => {
    setProductCompare(false)
  }

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.basket.catalogText')}</title>
        <meta name="title" content={translate('label.basket.catalogText')} />
        <meta name="description" content={translate('label.basket.catalogText')} />
        <meta name="keywords" content={translate('label.search.searchText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.basket.catalogText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.basket.catalogText')} key="ogdesc" />
      </NextHead>
      <div className="container pt-10 pb-24 mx-auto">
        <div className="max-w-screen-sm">
          <h1 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {translate('label.basket.catalogText')}
          </h1>
          <div className='flex justify-between w-full align-bottom'>
            <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
              {translate('label.search.stepIntoWorldText')}
            </span>
          </div>
        </div>
        <div className='flex justify-between w-full pb-2 mt-1 mb-2 sm:pb-4 sm:mb-4 align-center'>
          <span className="inline-block text-xs font-medium text-slate-500 sm:px-0 dark:text-black"> {translate('label.search.resultCountText1')} <span className='font-semibold text-black'>{data.products.total}</span> {translate('common.label.resultsText')} </span>
          <div className="flex justify-end align-bottom">
            <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
          </div>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />

        <div className={`sm:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 grid w-full grid-cols-1 gap-1 px-0 mx-auto mt-3 overflow-hidden sm:px-0 lg:px-0`}>
          {isMobile ? (
            <ProductMobileFilters handleFilters={handleFilters} products={data.products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
          ) : (
            <div className='sm:col-span-3 md:col-span-3 lg:col-span-3'>
              <ProductFilterRight handleFilters={handleFilters} products={data.products} routerFilters={state.filters} />
            </div>
          )}
          <div className={`sm:col-span-9 lg:col-span-9 md:col-span-9`}>
            <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
            <ProductGrid products={productDataToPass} currentPage={state.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} />
          </div>
          <CompareSelectionBar name={translate('label.basket.catalogText')} showCompareProducts={showCompareProducts} products={data.products} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
        </div>
      </div>
      <Script
        type="application/ld+json"
        id="schema"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        {
          "@context": "https://schema.org/",
          "@type": "WebSite",
          "name": ${SITE_NAME},
          "url": ${SITE_ORIGIN_URL},
          "potentialAction": {
            "@type": "SearchAction",
            "target": ${router.query.freeText}
            "query-input": "required name=${router.query.freeText}" 
          }
        }
        `,
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const allProducts = await commerce.getAllProducts({ ...DEFAULT_STATE })
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      query: context.query,
      snippets: allProducts?.snippets ?? [],
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(Search, PAGE_TYPE)
