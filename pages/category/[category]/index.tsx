import { useReducer, useState, useEffect } from 'react'
import Link from 'next/link'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useSwr from 'swr'
import 'swiper/css'
import 'swiper/css/navigation'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import getAllCategoriesStaticPath from '@framework/category/get-all-categories-static-path'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes, stringToNumber } from '@framework/utils/parse-util'
import { getCategoryBySlug } from '@framework/category'
import { parsePLPFilters, routeToPLPWithSelectedFilters, setPLPFilterSelection, } from 'framework/utils/app-util'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { maxBasketItemsCount, setPageScroll, notFoundRedirect, logError, sanitizeRelativeUrl } from '@framework/utils/app-util'
import commerce from '@lib/api/commerce'
import { useTranslation } from '@commerce/utils/use-translation'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { postData } from '@components/utils/clientFetcher'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui'
import { BLOG_COLS, BLOG_PAGE_ID, CURRENT_THEME, EmptyGuid, EmptyObject, EmptyString, NEXT_GET_CATALOG_PRODUCTS, SITE_ORIGIN_URL } from '@components/utils/constants'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
import { Guid } from '@commerce/types'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { AnalyticsEventType } from '@components/services/analytics'
import LandingCategory from '@components/category/LandingCategory'
import CategoryList from '@components/category/CategoryList'
import RichLandingCategory from '@components/category/RichLandingCategory'

const PAGE_TYPE = PAGE_TYPES.CategoryList
declare const window: any

export async function getStaticProps(context: any) {
  const { locale, locales } = context
  const slugName = Object.keys(context.params)[0]
  const slug = slugName + '/' + context.params[slugName]

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })

  const cachedDataUID = {
    allMembershipsUID: Redis.Key.ALL_MEMBERSHIPS + '_' + locale,
    infraUID: Redis.Key.INFRA_CONFIG + '_' + locale,
    categorySlugUID: Redis.Key.Category.Slug + '_' + slug + '_' + locale,
    categoryProductUID: Redis.Key.Category.CategoryProduct + '_' + slug + '_' + locale,
    blogListUID: Redis.Key.Blog.blogList + '_' + locale,
  }
  const cachedData = await getDataByUID([
    cachedDataUID.allMembershipsUID,
    cachedDataUID.infraUID,
    cachedDataUID.categorySlugUID,
    cachedDataUID.categoryProductUID,
  ])

  let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
  let categorySlugUIDData: any = parseDataValue(cachedData, cachedDataUID.categorySlugUID)
  let categoryProductUIDData: any = parseDataValue(cachedData, cachedDataUID.categoryProductUID)
  let blogListUIDData: any = parseDataValue(cachedData, cachedDataUID.blogListUID)

  try {
    if (!categorySlugUIDData) {
      categorySlugUIDData = await getCategoryBySlug(slug, { [Cookie.Key.LANGUAGE]: locale })
      await setData([{ key: cachedDataUID.categorySlugUID, value: categorySlugUIDData }])
    }
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra({ [Cookie.Key.LANGUAGE]: locale })
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }

    if (!blogListUIDData) {
      const BlogContentsPromise = commerce.getBlogList({
        pagetypeId: BLOG_PAGE_ID, //Constant pageId,
        skip: 0, //skip,
        pagesize: 100, //pagesize,s
        sortby: 3, //sortby,
        sortorder: 1, //sortorder,
        cols: BLOG_COLS, //"blogheader.blogheader_mainimage",
      })
      blogListUIDData = await BlogContentsPromise
      await setData([{ key: cachedDataUID.blogListUID, value: blogListUIDData }])
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

  let allMembershipsUIDData: any = parseDataValue(cachedData, cachedDataUID.allMembershipsUID)
  if (!allMembershipsUIDData) {
    const data = {
      "SearchText": null,
      "PricingType": 0,
      "Name": null,
      "TermType": 0,
      "IsActive": 1,
      "ProductId": Guid.empty,
      "CategoryId": Guid.empty,
      "ManufacturerId": Guid.empty,
      "SubManufacturerId": Guid.empty,
      "PlanType": 0,
      "CurrentPage": 0,
      "PageSize": 0
    }
    const membershipPlansPromise = commerce.getMembershipPlans({ data, cookies: { [Cookie.Key.LANGUAGE]: locale } })
    allMembershipsUIDData = await membershipPlansPromise
    await setData([{ key: cachedDataUID.allMembershipsUID, value: allMembershipsUIDData }])
  }

  let defaultDisplayMembership = EmptyObject
  if (allMembershipsUIDData?.result?.length) {
    const membershipPlan = allMembershipsUIDData?.result?.sort((a: any, b: any) => a?.price?.raw?.withTax - b?.price?.raw?.withTax)[0]
    if (membershipPlan) {
      const promoCode = membershipPlan?.membershipBenefits?.[0]?.code
      if (promoCode) {
        const promotion = await commerce.getPromotion(promoCode, { [Cookie.Key.LANGUAGE]: locale })
        defaultDisplayMembership = { membershipPromoDiscountPerc: stringToNumber(promotion?.result?.additionalInfo1), membershipPrice: membershipPlan?.price?.raw?.withTax }
      }
    }
  }

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    if (categorySlugUIDData?.status === "NotFound") {
      return { ...notFoundRedirect(), revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS), };
    }
  }

  if (categorySlugUIDData && categorySlugUIDData?.id) {
    if (!categoryProductUIDData) {
      const categoryProductUIDData = await commerce.getCategoryProducts(categorySlugUIDData?.id, { [Cookie.Key.LANGUAGE]: locale })
      await setData([{ key: cachedDataUID.categoryProductUID, value: categoryProductUIDData }])
      return {

        props: {
          ...pageProps,
          category: categorySlugUIDData,
          slug,
          products: categoryProductUIDData,
          globalSnippets: infraUIDData?.snippets ?? [],
          snippets: categorySlugUIDData?.snippets ?? [],
          defaultDisplayMembership,
          blogList : blogListUIDData?.pages ?? []
        },
        revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
      }
    } else {
      return {
        props: {
          ...pageProps,
          category: categorySlugUIDData,
          slug,
          products: categoryProductUIDData,
          globalSnippets: infraUIDData?.snippets ?? [],
          snippets: categorySlugUIDData?.snippets ?? [],
          defaultDisplayMembership,
          blogList : blogListUIDData?.pages ?? []
        },
        revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
      }
    }
  } else {
    return {
      props: {
        ...pageProps,
        category: categorySlugUIDData,
        slug,
        products: null,
        globalSnippets: infraUIDData?.snippets ?? [],
        snippets: categorySlugUIDData?.snippets ?? [],
        defaultDisplayMembership,
        blogList : blogListUIDData?.pages ?? []
      },
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
    }
  }
}

const generateCategories = (categories: any) => {
  const categoryMap: any = []
  const generateCategory = (category: any) => {
    if (category.link) {
      category.link.includes('category/')
        ? categoryMap.push(`/${category.link}`)
        : categoryMap.push(`/category/${category.link}`)
    }
  }
  categories.forEach((category: any) => generateCategory(category))
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
  SET_FILTERS: 'SET_FILTERS',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
  SET_CATEGORY_ID: 'SET_CATEGORY_ID',
  RESET_STATE: 'RESET_STATE'
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

function CategoryLandingPage({ category, slug, products, deviceInfo, config, featureToggle, campaignData, defaultDisplayMembership, blogList }: any) {
  const { isMobile } = deviceInfo
  const router = useRouter()
  const qsFilters = router.asPath
  const filters: any = parsePLPFilters(qsFilters as string)
  const [previousSlug, setPreviousSlug] = useState(router?.asPath?.split('?')[0]);
  const translate = useTranslation()
  const adaptedQuery: any = { ...router.query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false
  const [isProductCompare, setProductCompare] = useState(false)
  const { isCompared } = useUI()
  const initialState = {
    ...DEFAULT_STATE,
    // Setting initial filters from query string
    filters: filters ? filters : [],
    // if featuredProductCSV and LinkGroup
    stockCodes: (category?.featuredProductCSV && category?.linkGroups?.length) ? category?.featuredProductCSV?.split(',') : [],
    categoryId: category?.id,
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: state?.filters || [],
        categoryId: category?.id,
      },
    },
    error,
    isValidating
  } = useSwr(
    [
      `/api/catalog/products`,
      { ...state, ...{ slug: slug, isCategory: true, excludeOOSProduct, categoryId: category?.id, } },
    ],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
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

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      categoryId: category?.id,
      sortBy: null,
    },
  })
  const [productDataToPass, setProductDataToPass] = useState(data?.products)

  useEffect(() => {
    if (state?.filters?.length) {
      routeToPLPWithSelectedFilters(router, state?.filters)
    }
    setPLPFilterSelection(state?.filters)
  }, [state?.filters])

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    // clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }

  useAnalytics(AnalyticsEventType.CATEGORY_VIEWED, {
    category, entityName: PAGE_TYPE,
    entityType: EVENTS_MAP.ENTITY_TYPES.Category,
  })

  useEffect(() => {
    // for Engage
    if (typeof window !== "undefined" && window?.ch_session) {
      window.ch_page_view_before({ item_id: category?.name || EmptyString })
    }
  }, [category.id])

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data.products.currentPage !== productListMemory.products.currentPage ||
      data.products.total !== productListMemory.products.total ||
      data.products.sortBy !== productListMemory.products.sortBy
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
    const trackScroll = (ev: any) => {
      setPageScroll(window?.location, ev.currentTarget.scrollX, ev.currentTarget.scrollY)
    }

    const isScrollEnabled = SCROLLABLE_LOCATIONS.find((x: string) => location.pathname.startsWith(x))
    if (isScrollEnabled) {
      window?.addEventListener('scroll', trackScroll)
      return () => {
        window?.removeEventListener('scroll', trackScroll)
      }
    }
  }, [])

  useEffect(() => {
    const dataToPass = IS_INFINITE_SCROLL ? productListMemory?.products : data?.products
    setProductDataToPass(dataToPass)
  }, [productListMemory?.products, data?.products])

  const setFilter = (filters: any) => {
    dispatch({ type: SET_FILTERS, payload: filters })
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
    if (filters?.length == 1 && type == REMOVE_FILTERS) {
      routeToPLPWithSelectedFilters(router, [])
    }
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
  const clearAll = () => {
    routeToPLPWithSelectedFilters(router, [])
    dispatch({ type: CLEAR })
  }

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

  const removeFilter = (key: string) => {
    if (filters?.length == 1) {
      routeToPLPWithSelectedFilters(router, [])
    }
    dispatch({ type: REMOVE_FILTERS, payload: key })
  }

  /*const productDataToPass =
    IS_INFINITE_SCROLL && productListMemory.products?.results?.length
      ? productListMemory.products
      : products*/
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
  const onToggleBrandListPage = () => {
    router.push(`/category/shop-all/${slug?.replace('category/', '')}`)
  }
  const filterBrandData = ({ key, brand }: any) => {
    clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{category?.name || translate('label.category.categoryText')}</title>
        <meta name="title" content={category?.name || translate('label.category.categoryText')} />
        <meta name="description" content={category?.metaDescription} />
        <meta name="keywords" content={category?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={category?.name} key="ogtitle" />
        <meta property="og:description" content={category?.metaDescription} key="ogdesc" />
      </NextHead>
      <section className="main-section fixing-main-section dark:bg-white">
        {!featureToggle.features?.enableForPCSite &&
          <>
            <div className="container mx-auto mt-2 bg-transparent dark:bg-white">
              {category?.breadCrumbs && (
                <BreadCrumbs items={category?.breadCrumbs} currentProduct={category} />
              )}
            </div>
            <div className="container">
              <div className={`max-w-screen-sm max-t-full ${CURRENT_THEME == 'green' ? 'mx-auto text-center sm:py-0 py-3 -mt-4' : ''}`}>
                <h1 className={`block text-2xl capitalize dark:text-black ${CURRENT_THEME == 'green' ? 'sm:text-4xl lg:text-5xl font-bold' : 'sm:text-3xl lg:text-4xl font-semibold'}`}>
                  {category?.name.toLowerCase()}
                </h1>
                {category?.description &&
                  <div className='w-full'>
                    <span className={`block text-neutral-500 dark:text-neutral-500 ${CURRENT_THEME == 'green' ? 'text-sm mt-2 mb-2' : 'text-sm mt-4'}`}>
                      <span className={`block text-neutral-500 dark:text-neutral-500 ${CURRENT_THEME == 'green' ? 'text-sm mt-2 mb-2' : 'text-sm mt-4'}`} dangerouslySetInnerHTML={{ __html: category?.description }} ></span>
                    </span>
                  </div>
                }
              </div>
            </div>
          </>
        }
        {category?.isFeatured && category?.linkGroups?.length > 0 ?
          (
            <>
              {featureToggle?.features?.enableForPCSite ? (
                <RichLandingCategory blogList={blogList} category={category} deviceInfo={deviceInfo} filterBrandData={filterBrandData} productDataToPass={productDataToPass} onToggleBrandListPage={onToggleBrandListPage} maxBasketItemsCount={maxBasketItemsCount} config={config} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} campaignData={campaignData} />
              ) : (
                <LandingCategory category={category} deviceInfo={deviceInfo} filterBrandData={filterBrandData} productDataToPass={productDataToPass} onToggleBrandListPage={onToggleBrandListPage} maxBasketItemsCount={maxBasketItemsCount} config={config} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} campaignData={campaignData} />
              )}
            </>
          ) : (
            <CategoryList shopAll={false} featureToggle={featureToggle} category={category} handleFilters={handleFilters} productDataToPass={productDataToPass} state={state} data={data} excludeOOSProduct={excludeOOSProduct} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} config={config} isCompared={isCompared} defaultDisplayMembership={defaultDisplayMembership} closeCompareProducts={closeCompareProducts} onEnableOutOfStockItems={onEnableOutOfStockItems} isValidating={isValidating} isMobile={isMobile} products={products} handleSortBy={handleSortBy} clearAll={clearAll} removeFilter={removeFilter} isProductCompare={isProductCompare} showCompareProducts={showCompareProducts} handlePageChange={handlePageChange} campaignData={campaignData} />
          )}
      </section>
    </>
  )
}
export default withDataLayer(CategoryLandingPage, PAGE_TYPE)
