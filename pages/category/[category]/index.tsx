import Link from 'next/link'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useReducer, useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getCategoryBySlug } from '@framework/category'
import { getCategoryProducts } from '@framework/api/operations'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
import { logError, maxBasketItemsCount, notFoundRedirect, setPageScroll } from '@framework/utils/app-util'
import { ProductCard } from '@components/product'
import axios from 'axios'
import { NEXT_GET_CATALOG_PRODUCTS, SITE_ORIGIN_URL } from '@components/utils/constants'
import CompareSelectionBar from '@components/product/ProductCompare/compareSelectionBar'
import { useUI } from '@components/ui'
import { sanitizeHtmlContent } from 'framework/utils/app-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import OutOfStockFilter from '@components/product/Filters/OutOfStockFilter'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
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
  const slug = slugName + '/' + context.params[slugName]

  const cachedDataUID = {
    infraUID: Redis.Key.INFRA_CONFIG,
    categorySlugUID: Redis.Key.Category.Slug + '_' + slug,
    categoryProductUID: Redis.Key.Category.CategoryProduct + '_' + slug,
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
    if(!categorySlugUIDData){
      categorySlugUIDData = await getCategoryBySlug(slug)
      await setData([{ key: cachedDataUID.categorySlugUID, value: categorySlugUIDData }])
    }
    if(!infraUIDData){
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
    if(!categoryProductUIDData){
      const categoryProductUIDData = await getCategoryProducts(categorySlugUIDData?.id)
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
  } else{
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
}else{
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
  SET_CATEGORY_ID,
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
      return { ...state, currentPage: 1, sortOrder: payload }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case SET_CATEGORY_ID:
      return { ...state, categoryId: payload }
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

function CategoryLandingPage({
  category,
  slug,
  products,
  deviceInfo,
  config,
}: any) {
  const { isMobile } = deviceInfo
  const router = useRouter()
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
    filters: adaptedQuery.filters || [],
    categoryId: category.id,
  }
  const [isLoading, setIsLoading] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [minimalProd, setMinimalProd] = useState<any>([])
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
        categoryId: category.id,
      },
    },
    error,
  } = useSwr(
    [
      `/api/catalog/products`,
      { ...state, ...{ slug: slug, isCategory: true ,excludeOOSProduct} },
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
      categoryId: category.id,
    },
  })
  const [productDataToPass, setProductDataToPass] = useState(data?.products)

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }

  useEffect(() => {
    if (category.id !== state.categoryId)
      dispatch({ type: SET_CATEGORY_ID, payload: category.id })
  }, [category.id])

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
    let CSVCollection: any = []
    if (category.featuredProductCSV != '' && category.featuredProductCSV) {
      CSVCollection = category?.featuredProductCSV?.split(',')
      async function handleApiCall() {
        const data: any = Promise.all(
          CSVCollection?.map(async (val: any) => {
            const res = await axios.post(NEXT_GET_CATALOG_PRODUCTS, {
              sortBy: '',
              sortOrder: '',
              currentPage: 1,
              filters: [],
              freeText: val || '',
            })
            return res?.data.products
          })
        )
          .then((results) => {
            setMinimalProd(results)
          })
          .catch((err) => {
            console.log(err)
          })
      }
      handleApiCall()
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

  }, [])

  useEffect(() => {
    const dataToPass = IS_INFINITE_SCROLL
      ? productListMemory?.products
      : data?.products // productListMemory?.products
    setProductDataToPass(dataToPass)
  }, [productListMemory?.products, data?.products])

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
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
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

  const removeFilter = (key: string) => {
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
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{category?.name || translate('label.category.categoryText')}</title>
        <meta name="title" content={category?.name || translate('label.category.categoryText')} />
        <meta name="description" content={category?.metaDescription} />
        <meta name="keywords" content={category?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={category?.name} key="ogtitle" />
        <meta
          property="og:description"
          content={category?.metaDescription}
          key="ogdesc"
        />
      </NextHead>
      <section className="main-section">
        <div className="container mx-auto mt-4 bg-transparent lg:pt-6">
          {category?.breadCrumbs && (
            <BreadCrumbs
              items={category?.breadCrumbs}
              currentProduct={category}
            />
          )}
        </div>
        <div className="container mx-auto my-0 mt-4 bg-transparent">
          <h1 className='dark:text-black'>{category?.name}</h1>
          <div
            className="font-18"
            dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(category?.description) }}
          ></div>
        </div>
        {/* popular category start */}
        {category?.isFeatured != false ? (
          <div className="w-full">
            <div className="py-4">
              {category?.subCategories?.filter((x: any) => x.isFeatured == true)
                .length > 0 && (
                <div className="container mx-auto mb-4">
                  <h2 className="font-bold font-18">Popular categories</h2>
                </div>
              )}
              <Swiper
                // install Swiper modules
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                loop={false}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 2.5,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1400: {
                    slidesPerView: 4,
                  },
                }}
                className="mySwier"
              >
                {category?.subCategories?.map(
                  (featurecat: any, cdx: number) => (
                    <div key={cdx}>
                      {featurecat?.isFeatured == true && (
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              {featurecat?.image != '' ? (
                                <img
                                  src={generateUri(featurecat?.image,'h=160&fm=webp')||IMG_PLACEHOLDER}
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              ) : (
                                <img
                                  src="/default-img.svg"
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              )}
                            </>
                            <div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
                              <Link
                                href={`/${featurecat?.link}`}
                                className="btn-primary-white font-14"
                              >
                                <span>{featurecat?.name}</span>
                              </Link>
                            </div>
                          </div>
                        </SwiperSlide>
                      )}
                    </div>
                  )
                )}
              </Swiper>
            </div>
            {/* popular category start */}

            {/* category banner info start */}
            <div className="w-full py-4">
              {category && category?.images && category?.images.length ? (
                <>
                  {category?.images.map((cat: any, idx: number) => (
                    <div
                      className="relative grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2"
                      key={idx}
                    >
                      <div className="flex items-center justify-center order-2 p-4 py-8 bg-blue-web sm:py-0 sm:p-0 sm:order-1">
                        <div className="w-full h-full">
                          <div className="relative sm:absolute sm:top-2/4 sm:left-2/4 sm:-translate-x-2/4 sm:-translate-y-2/4 cat-container">
                            <div className="sm:w-2/4 sm:pr-20">
                              <h2 className="text-white uppercase">
                                {cat?.name}
                              </h2>
                              <p className="mt-5 font-light text-white">
                                {cat?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="order-1 sm:order-2">
                        <img
                          src={
                            generateUri(cat?.url, 'h=700&fm=webp') ||
                            IMG_PLACEHOLDER
                          }
                          className="w-full"
                          alt={category?.name || 'Image'}
                          width={700}
                          height={700}
                        />
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
            {/* category banner info End */}

            {/* feature brand section start*/}
            <div className="px-4 py-6 mx-auto md:w-4/5 sm:px-0">
              <div className="grid max-w-lg gap-5 mx-auto lg:grid-cols-3 lg:max-w-none">
                {category?.featuredBrand?.map((feature: any, fdx: number) => (
                  <div
                    className="flex flex-col overflow-hidden shadow-lg"
                    key={fdx}
                  >
                    <div className="flex-shrink-0">
                      <>
                        {feature?.logoImageName != '' ? (
                          <img
                            src={generateUri(feature?.logoImageName,'h=240&fm=webp') || IMG_PLACEHOLDER}
                            className="object-fill object-center w-full"
                            alt="Image"
                            width={240}
                            height={160}
                          />
                        ) : (
                          <img
                            src="/default-img.svg"
                            className="object-fill object-center w-full"
                            alt="Image"
                            width={240}
                            height={160}
                          />
                        )}
                      </>
                    </div>
                    <div className="flex flex-col justify-between flex-1 p-6 bg-blue-web">
                      <div className="flex-1">
                        <Link href={`/${feature?.slug}`} className="block mt-2">
                          <p className="text-xl font-semibold text-white">
                            {feature?.manufacturerName}
                          </p>
                          <div
                            className="mt-3 text-white font-18"
                            dangerouslySetInnerHTML={{
                             __html: sanitizeHtmlContent( feature?.description),
                            }}
                          ></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* feature brand section End*/}

            {minimalProd?.length > 0 && (
              <div className="py-6">
                <div className="px-4 mx-auto mb-4 md:w-4/5 sm:px-0">
                  <h2 className="mb-2 font-bold uppercase font-18">
                    {translate('label.category.relatedCategoriesText')}
                  </h2>
                  <Swiper
                    // install Swiper modules
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    loop={false}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2.5,
                      },
                      1024: {
                        slidesPerView: 4,
                      },
                      1400: {
                        slidesPerView: 5,
                      },
                    }}
                    className="mySwier"
                  >
                    {minimalProd?.map((product: any, cdx: number) => (
                      <>
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              <ProductCard
                                product={product.results || []}
                                deviceInfo={deviceInfo}
                                maxBasketItemsCount={maxBasketItemsCount(
                                  config
                                )}
                              />
                            </>
                          </div>
                        </SwiperSlide>
                      </>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

            {/* feature brand section End*/}

            {/* related category  */}
            <div className="py-6">
              <div className="px-4 mx-auto mb-4 2xl:w-4/5 sm:px-4 lg:px-6 2xl:px-0">
                <h2 className="mb-2 font-bold uppercase font-18">
                  {translate('label.category.relatedCategoriesText')}
                </h2>
                <Swiper
                  // install Swiper modules
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={true}
                  loop={false}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 2.5,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                    1400: {
                      slidesPerView: 5,
                    },
                  }}
                  className="mySwier"
                >
                  {category?.linkGroups?.length > 0 &&
                    category?.linkGroups[0]?.items?.map(
                      (relatedcat: any, cdx: number) => (
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              {relatedcat?.image != '' ? (
                                <img
                                  src="/default-img.svg"
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              ) : (
                                <img
                                  src="/default-img.svg"
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              )}
                            </>
                            <div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
                              <Link
                                href={`/${relatedcat?.link}`}
                                className="btn-primary-white font-14"
                              >
                                <span>{relatedcat?.name}</span>
                              </Link>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}
                </Swiper>
              </div>
            </div>
            {/* related category  */}
            {/* related feature products start */}
          </div>
        ) : (
          <>
            <div className="w-full px-0 py-0 mx-auto sm:px-0">
              {/* category banner info start */}
              <div className="container py-0 mx-auto">
                {category && category?.images && category?.images.length ? (
                  <>
                    {category?.images.map((cat: any, idx: number) => (
                      <div
                        className="relative grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2"
                        key={idx}
                      >
                        <div className="flex items-center justify-center order-2 w-full h-full p-4 py-8 bg-blue-web sm:py-0 sm:p-0 sm:order-1">
                          <div className="relative sm:absolute sm:top-2/4 sm:left-2/4 sm:-translate-x-2/4 sm:-translate-y-2/4 cat-container">
                            <div className="sm:w-2/4 sm:pr-20">
                              <h2 className="text-white uppercase">
                                {cat?.name}
                              </h2>
                              <p className="mt-5 font-light text-white">
                                {cat?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="order-1 sm:order-2">
                          <img
                            src={
                              generateUri(cat?.url, 'h=700&fm=webp') ||
                              IMG_PLACEHOLDER
                            }
                            className="w-full"
                            alt={category?.name || 'category'}
                            width={700}
                            height={700}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
              {/* category banner info End */}
              <div className="py-0">
                {category?.subCategories?.filter(
                  (x: any) => x.isFeatured == true
                ).length > 0 && (
                  <h2 className="container mx-auto mb-4 font-bold font-18">
                    {translate('label.category.popularCategoriesText')}
                  </h2>
                )}
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={true}
                  loop={false}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2.5,
                    },
                    1024: {
                      slidesPerView: 6,
                    },
                    1400: {
                      slidesPerView: 6,
                    },
                  }}
                  className="mySwier"
                >
                  {category?.subCategories?.map(
                    (featurecat: any, ckdx: number) => (
                      <div key={ckdx}>
                        {featurecat?.isFeatured == true && (
                          <SwiperSlide key={ckdx}>
                            <div className="relative group">
                              <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                              <>
                                {featurecat?.image != '' ? (
                                  <img
                                    src={generateUri(featurecat?.image,'h=240&fm=webp')||IMG_PLACEHOLDER}
                                    className="object-fill object-center w-full"
                                    alt="Image"
                                    width={240}
                                    height={160}
                                  />
                                ) : (
                                  <img
                                    src="/default-img.svg"
                                    className="object-fill object-center w-full"
                                    alt="Image"
                                    width={240}
                                    height={160}
                                  />
                                )}
                              </>
                              <div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
                                <Link
                                  href={`/${featurecat?.link}`}
                                  className="btn-primary-white font-14"
                                >
                                  <span>{featurecat?.name}</span>
                                </Link>
                              </div>
                            </div>
                          </SwiperSlide>
                        )}
                      </div>
                    )
                  )}
                </Swiper>
              </div>
              {/* popular category start */}
              {products?.total > 0 ? (
                <div className="container grid grid-cols-1 mx-auto sm:grid-cols-12">
                  {!!products &&
                    (products?.filters?.length > 0 ? (
                      <>
                        {isMobile ? (
                          <ProductMobileFilters
                            handleFilters={handleFilters}
                            products={products}
                            routerFilters={state.filters}
                            handleSortBy={handleSortBy}
                            clearAll={clearAll}
                            routerSortOption={state.sortBy}
                            removeFilter={removeFilter}
                          />
                        ) : (
                          <>
                            <div className="flex justify-end w-full col-span-12">
                              <OutOfStockFilter
                                excludeOOSProduct={excludeOOSProduct}
                                onEnableOutOfStockItems={onEnableOutOfStockItems}
                              />
                            </div>
                          <ProductFilterRight
                            handleFilters={handleFilters}
                            products={productDataToPass}
                            routerFilters={state.filters}
                          />
                          </>
                        )}
                        <div className="sm:col-span-10 p-[1px]">
                          {isMobile ? null : (
                            <>
                              <div className="flex justify-end w-full col-span-12">
                                <OutOfStockFilter
                                  excludeOOSProduct={excludeOOSProduct}
                                  onEnableOutOfStockItems={onEnableOutOfStockItems}
                                  />
                              </div>
                              <ProductFiltersTopBar
                                products={productDataToPass}
                                handleSortBy={handleSortBy}
                                routerFilters={state.filters}
                                clearAll={clearAll}
                                routerSortOption={state.sortBy}
                                removeFilter={removeFilter}
                              />
                            </>  
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
                      <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                        <div className="flex justify-end w-full col-span-12">
                          <OutOfStockFilter
                            excludeOOSProduct={excludeOOSProduct}
                            onEnableOutOfStockItems={onEnableOutOfStockItems}
                            />
                        </div>
                        <ProductFiltersTopBar
                          products={productDataToPass}
                          handleSortBy={handleSortBy}
                          routerFilters={state.filters}
                          clearAll={clearAll}
                          routerSortOption={state.sortBy}
                          removeFilter={removeFilter}
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
                    ))}
                  <CompareSelectionBar
                    name={category?.name}
                    showCompareProducts={showCompareProducts}
                    products={productDataToPass}
                    isCompare={isProductCompare}
                    maxBasketItemsCount={maxBasketItemsCount(config)}
                    closeCompareProducts={closeCompareProducts}
                    deviceInfo={deviceInfo}
                  />
                </div>
              ) : (
                <div className="p-4 py-8 mx-auto text-center sm:p-32 max-w-7xl">
                  <h4 className="text-3xl font-bold text-gray-300">
                    {translate('common.label.noProductAvailableText')} {category?.name}
                  </h4>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default withDataLayer(CategoryLandingPage, PAGE_TYPE)
