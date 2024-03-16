import { useReducer, useState, useEffect } from 'react'
import Link from 'next/link'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useSwr from 'swr'

// Component Imports
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getCategoryBySlug } from '@framework/category'
import { getCategoryProducts } from '@framework/api/operations'
import { postData } from '@components/utils/clientFetcher'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import 'swiper/css'
import 'swiper/css/navigation'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
import { maxBasketItemsCount, setPageScroll, notFoundRedirect, logError } from '@framework/utils/app-util'
import CompareSelectionBar from '@components/product/ProductCompare/compareSelectionBar'
import { useUI } from '@components/ui'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { sanitizeHtmlContent } from 'framework/utils/app-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import OutOfStockFilter from '@components/product/Filters/OutOfStockFilter'
import { useTranslation } from '@commerce/utils/use-translation'
import getAllCategoriesStaticPath from '@framework/category/get-all-categories-static-path'
const ProductFilterRight = dynamic(() => import('@components/product/Filters/filtersRight'))
const ProductMobileFilters = dynamic(() => import('@components/product/Filters'))
const ProductFiltersTopBar = dynamic(() => import('@components/product/Filters/FilterTopBar'))
const ProductGridWithFacet = dynamic(() => import('@components/product/Grid'))
const ProductGrid = dynamic(() => import('@components/product/Grid/ProductGrid'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const PAGE_TYPE = PAGE_TYPES.Category
declare const window: any

export async function getStaticProps(context: any) {
  const slugName = Object.keys(context.params)[0]
  const childSlugName = Object.keys(context.params)[1]
  const slug =
    slugName +
    '/' +
    context.params[slugName] +
    '/' +
    context.params[childSlugName].join('/')

  const cachedDataUID = {
    infraUID: Redis.Key.INFRA_CONFIG,
    categorySlugUID: Redis.Key.Category.Slug + '_' + slug,
    categoryProductUID: Redis.Key.Category.CategoryProduct + '_' + slug
  }

  const cachedData = await getDataByUID([
    cachedDataUID.infraUID,
    cachedDataUID.categorySlugUID,
    cachedDataUID.categoryProductUID,
  ])

  let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
  let categorySlugUIDData: any = parseDataValue(cachedData, cachedDataUID.categorySlugUID)
  let categoryProductUIDData: any = parseDataValue(cachedData, cachedDataUID.categoryProductUID)

  try {
    if (!categorySlugUIDData) {
      categorySlugUIDData = await getCategoryBySlug(slug)
      // save to redis
      await setData([{ key: cachedDataUID.categorySlugUID, value: categorySlugUIDData }])
    }
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra()
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }
  } catch (error: any) {
    logError(error)

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
    }
  }

  if (categorySlugUIDData?.status === "NotFound") {
    return notFoundRedirect()
  }

  if (categorySlugUIDData && categorySlugUIDData?.id) {
    if (!categoryProductUIDData) {
      categoryProductUIDData = await getCategoryProducts(categorySlugUIDData?.id)
      await setData([{ key: cachedDataUID.categoryProductUID, value: categoryProductUIDData }])
      return {
        props: {
          category: categorySlugUIDData,
          slug,
          products: categoryProductUIDData,
          globalSnippets: infraUIDData?.snippets ?? [],
          snippets: categorySlugUIDData?.snippets ?? [],
        },
        revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
      }
    }
    else {
      return {
        props: {
          category: categorySlugUIDData,
          slug,
          products: categoryProductUIDData,
          globalSnippets: infraUIDData?.snippets ?? [],
          snippets: categorySlugUIDData?.snippets ?? [],
        },
        revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
      }
    }
  } else
    return {
      props: {
        category: categorySlugUIDData,
        slug,
        products: null,
        globalSnippets: infraUIDData?.snippets ?? [],
        snippets: categorySlugUIDData?.snippets ?? [],
      },
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
    }
}

const generateCategories = (categories: any) => {
  const categoryMap: any = []
  const generateCategory = (category: any, categoryPrefix: any) => {
    if (category?.link) {
      const segments = category.link.split('/')
      if (segments.length >= 3) {
        category?.link.includes('category/') ? categoryMap.push(`/${category?.link}`) : categoryMap.push(`/${categoryPrefix}/${category?.link}`)
      }
    }
    if (category?.subCategories) {
      category?.subCategories.forEach((i: any) => {
        generateCategory(i, category?.link)
      })
    }
  }
  categories.forEach((category: any) =>
    generateCategory(category, category?.link)
  )
  return categoryMap
}

export async function getStaticPaths() {
  const data = await getAllCategoriesStaticPath()
  return {
    paths: generateCategories(data),
    fallback: 'blocking',
  }
}

export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
  SET_CATEGORY_ID: 'SET_CATEGORY_ID',
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
  categoryId: any
}

const IS_INFINITE_SCROLL = process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
const { SORT_BY, PAGE, SORT_ORDER, CLEAR, HANDLE_FILTERS_UI, ADD_FILTERS, REMOVE_FILTERS, SET_CATEGORY_ID, } = ACTION_TYPES
const DEFAULT_STATE = { sortBy: '', sortOrder: 'asc', currentPage: 1, filters: [], categoryId: '', }

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
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case REMOVE_FILTERS:
      return { ...state, filters: state.filters.filter((item: any) => item.Value !== payload.Value), }
    default:
      return { ...state }
  }
}

function CategoryPage({ category, slug, products, deviceInfo, config }: any) {
  const { isMobile } = deviceInfo
  const router = useRouter()
  const translate = useTranslation()
  const adaptedQuery: any = { ...router.query }
  adaptedQuery.currentPage ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage)) : false
  adaptedQuery.filters ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters)) : false
  const [isProductCompare, setProductCompare] = useState(false)
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
  const { isCompared } = useUI()
  const initialState = { ...DEFAULT_STATE, filters: adaptedQuery.filters || [], categoryId: category?.id, }

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
        categoryId: category?.id,
      },
    },
    error,
  } = useSwr(
    [
      `/api/catalog/products`,
      { ...state, ...{ slug: slug, isCategory: true, excludeOOSProduct } },
    ],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      categoryId: category?.id,
    },
  })
  const [productDataToPass, setProductDataToPass] = useState(data?.products)

  useEffect(() => {
    if (category?.id !== state.categoryId)
      dispatch({ type: SET_CATEGORY_ID, payload: category?.id })
  }, [category?.id])

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data?.products?.currentPage !==
      productListMemory?.products?.currentPage ||
      data?.products?.total !== productListMemory?.products?.total
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone = { ...data }
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

  useEffect(() => {
    const dataToPass = IS_INFINITE_SCROLL
      ? productListMemory?.products
      : data?.products // productListMemory?.products
    setProductDataToPass(dataToPass)
  }, [productListMemory?.products, products])

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }

  useEffect(() => {
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
    if (products.pages && products.currentPage < products.pages) {
      dispatch({ type: PAGE, payload: products.currentPage + 1 })
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
  const removeFilter = (key: string) => {
    dispatch({ type: REMOVE_FILTERS, payload: key })
  }
  const clearAll = () => dispatch({ type: CLEAR })

  // IMPLEMENT HANDLING FOR NULL OBJECT
  if (category === null) {
    return (
      <div className="container relative py-10 mx-auto text-center top-20">
        <h1 className="pb-6 text-3xl font-medium text-gray-400 font-30">
          {translate('common.label.badUrlText')}
          <Link href="/category">
            <span className="px-3 text-indigo-500">{translate('label.category.allCategoriesText')}</span>
          </Link>
        </h1>
      </div>
    )
  }

  const css = { maxWidth: '100%', height: 'auto' }
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{category?.metaTitle || category?.name}</title>
        <meta name="title" content={category?.metaTitle || category?.name} />
        <meta name="description" content={category?.metaDescription} />
        <meta name="keywords" content={category?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={category?.metaTitle || category?.name} key="ogtitle" />
        <meta property="og:description" content={category?.metaDescription} key="ogdesc" />
      </NextHead>
      <section className="main-section">
        <div className="container mx-auto mt-4 bg-transparent">
          {category?.breadCrumbs && (
            <BreadCrumbs items={category?.breadCrumbs} currentProduct={category} />
          )}
        </div>

        <div className="container mx-auto my-6 mt-4 bg-transparent">
          <h1 className='dark:text-black'>{category?.name}</h1>
          <div className="font-18 dark:text-black" dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(category?.description) }} ></div>
        </div>


        <div className="w-full py-4">
          {category && category?.images && category?.images.length ? (
            <>
              {category?.images.map((cat: any, idx: number) => (
                <div className="relative grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2" key={idx} >
                  <div className="flex items-center justify-center order-2 p-4 py-8 bg-blue-web sm:py-0 sm:p-0 sm:order-1">
                    <div className="w-full h-full">
                      <div className="relative sm:absolute sm:top-2/4 sm:left-2/4 sm:-translate-x-2/4 sm:-translate-y-2/4 cat-container">
                        <div className="sm:w-2/4 sm:pr-20">
                          <h2 className="text-white uppercase">{cat?.name}</h2>
                          <p className="mt-5 font-light text-white">
                            {cat?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 sm:order-2">
                    <img src={generateUri(cat?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} className="w-full" alt={category?.name || 'category'} width={700} height={700} />
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
        <div className="container py-6 mx-auto">
          {products?.total > 0 ? (
            <div className="grid w-full grid-cols-1 sm:grid-cols-12">
              {!!products && (products?.filters?.length > 0 ? (
                <>
                  {isMobile ? (
                    <ProductMobileFilters handleFilters={handleFilters} products={products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} />
                  ) : (
                    <>
                      <div className="flex float-right w-1/5 py-2 mt-1 -top-16">
                        <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
                      </div>
                      <ProductFilterRight handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                    </>
                  )}
                  <div className="sm:col-span-10 p-[1px]">
                    {isMobile ? null : (
                      <ProductFiltersTopBar products={products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} />
                    )}
                    <ProductGridWithFacet products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                  <div className="flex justify-end w-full col-span-12">
                    <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
                  </div>
                  <ProductFiltersTopBar products={productDataToPass} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} />
                  <ProductGrid products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} />
                </div>
              ))}
              <CompareSelectionBar name={category?.name} showCompareProducts={showCompareProducts} products={productDataToPass} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
            </div>
          ) : (
            <div className="p-4 py-8 mx-auto text-center sm:p-32 max-w-7xl">
              <h4 className="text-3xl font-bold text-gray-300">
                {translate('common.label.noProductAvailableText')} {category?.name}
              </h4>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default withDataLayer(CategoryPage, PAGE_TYPE)