import Link from 'next/link'
import Image from 'next/image'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useReducer, useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getAllCategories, getCategoryBySlug } from '@framework/category'
import { getCategoryProducts } from '@framework/api/operations'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import {
  ALL_CATEGORY,
  BAD_URL_TEXT,
  IMG_PLACEHOLDER,
  RESULTS,
} from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { matchStrings } from '@framework/utils/parse-util'
import CacheProductImages from '@components/product/ProductView/CacheProductImages'
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
const PAGE_TYPE = PAGE_TYPES.Category
declare const window: any

export async function getStaticProps(context: any) {
  const slugName = Object.keys(context.params)[0]
  const slug = slugName + '/' + context.params[slugName]
  const category = await getCategoryBySlug(slug)
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  if (category) {
    const categoryProducts = await getCategoryProducts(category.id)
    return {
      props: {
        category,
        slug,
        products: categoryProducts,
        globalSnippets: infra?.snippets ?? [],
        snippets: category?.snippets ?? [],
      },
      revalidate: 60,
    }
  } else
    return {
      props: {
        category,
        slug,
        products: null,
        globalSnippets: infra?.snippets ?? [],
        snippets: category?.snippets ?? [],
      },
      revalidate: 60,
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
    // if (category.subCategories) {
    //   category.subCategories.forEach((i: any) => generateCategory(i))
    // }
  }
  categories.forEach((category: any) => generateCategory(category))
  return categoryMap
}

export async function getStaticPaths() {
  const data = await getAllCategories()
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
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, filters: [] }
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
  const adaptedQuery: any = { ...router.query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false
  const initialState = {
    ...DEFAULT_STATE,
    filters: adaptedQuery.filters || [],
    categoryId: category.id,
  }
  const [isLoading, setIsLoading] = useState(true)
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
        categoryId: category.id,
      },
    },
    error,
  } = useSwr(
    [
      `/api/catalog/products`,
      { ...state, ...{ slug: slug, isCategory: true } },
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
  const [productDataToPass, setProductDataToPass] = useState(products)

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
    const data = IS_INFINITE_SCROLL
      ? productListMemory?.products
      : productListMemory?.products //props?.products
    setProductDataToPass(data)
  }, [productListMemory?.products, products])

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
        <h4 className="pb-6 text-3xl font-medium text-gray-400">
          {BAD_URL_TEXT}
          <Link href="/category">
            <span className="px-3 text-indigo-500">{ALL_CATEGORY}</span>
          </Link>
        </h4>
      </div>
    )
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
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" id="canonical" href={absPath} />
        <title>{category?.name || 'Category'}</title>
        <meta name="title" content={category?.name || 'Category'} />
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
        <div className="container px-4 mx-auto mt-4 bg-transparent sm:px-0">
          {category?.breadCrumbs && (
            <BreadCrumbs
              items={category?.breadCrumbs}
              currentProduct={category}
            />
          )}
        </div>
        <div className="container px-4 mx-auto my-6 mt-4 bg-transparent sm:px-0">
          <h1>{category?.name}</h1>
          <div
            className="font-18"
            dangerouslySetInnerHTML={{ __html: category?.description }}
          ></div>
        </div>
        {/* popular category start */}
        {category?.isFeatured != false ? (
          <div className="w-full">
            <div className="py-4">
              <div className="container px-4 mx-auto mb-4 sm:px-0">
                <h2 className="font-bold font-18">Popular categories</h2>
              </div>
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
                    slidesPerView: 4,
                  },
                }}
                className="mySwier"
              >
                {category?.subCategories?.map(
                  (featurecat: any, cdx: number) => (
                    <>
                      {featurecat?.isFeatured == true && (
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              {featurecat?.image != '' ? (
                                <Image
                                  src={featurecat?.image}
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              ) : (
                                <Image
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
                    </>
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
                        <Image
                          src={
                            generateUri(cat?.url, 'h=700&fm=webp') ||
                            IMG_PLACEHOLDER
                          }
                          className="w-full"
                          alt={category?.name}
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
                <div className="flex flex-col overflow-hidden shadow-lg">
                  <div className="flex-shrink-0">
                    <Image
                      src="/default-img.svg"
                      className="object-cover w-full h-auto"
                      alt="image"
                      width={700}
                      height={700}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-6 bg-blue-web">
                    <div className="flex-1">
                      <a href="#" className="block mt-2">
                        <p className="text-xl font-semibold text-white">
                          Dewalt KITS & PACKS
                        </p>
                        <p className="mt-3 text-white">
                          Unleash your full potential with DeWalt kits -
                          featuring a range of high-quality tools that are
                          durable, reliable, and designed to help you tackle any
                          project with ease.
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden shadow-lg">
                  <div className="flex-shrink-0">
                    <Image
                      src="/default-img.svg"
                      className="object-cover w-full h-auto"
                      alt="image"
                      width={700}
                      height={700}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-6 bg-blue-web">
                    <div className="flex-1">
                      <a href="#" className="block mt-2">
                        <p className="text-xl font-semibold text-white">
                          Dewalt KITS & PACKS
                        </p>
                        <p className="mt-3 text-white">
                          Unleash your full potential with DeWalt kits -
                          featuring a range of high-quality tools that are
                          durable, reliable, and designed to help you tackle any
                          project with ease.
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden shadow-lg">
                  <div className="flex-shrink-0">
                    <Image
                      src="/default-img.svg"
                      className="object-cover w-full h-auto"
                      alt="image"
                      width={700}
                      height={700}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-6 bg-blue-web">
                    <div className="flex-1">
                      <a href="#" className="block mt-2">
                        <p className="text-xl font-semibold text-white">
                          Dewalt KITS & PACKS
                        </p>
                        <p className="mt-3 text-white">
                          Unleash your full potential with DeWalt kits -
                          featuring a range of high-quality tools that are
                          durable, reliable, and designed to help you tackle any
                          project with ease.
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* feature brand section End*/}

            {/* related category  */}
            <div className="py-6">
              <div className="px-4 mx-auto mb-4 md:w-4/5 sm:px-0">
                <h2 className="mb-2 font-bold uppercase font-18">
                  related categories
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
                  {category?.linkGroups[0]?.items?.map(
                    (relatedcat: any, cdx: number) => (
                      <>
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              {relatedcat?.image != '' ? (
                                <Image
                                  src="/default-img.svg"
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              ) : (
                                <Image
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
                      </>
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
            <div className="w-full px-4 py-6 mx-auto sm:px-0">
              {/* category banner info start */}
              <div className="container py-4 mx-auto">
                {category && category?.images && category?.images.length ? (
                  <>
                    {category?.images.map((cat: any, idx: number) => (
                      <div
                        className="relative grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2"
                        key={idx}
                      >
                        <div className="flex items-center justify-center order-2 w-full h-full p-4 py-8 bg-blue-web sm:py-0 sm:p-0 sm:order-1">
                          <div className="relative sm:absolute sm:top-2/4 sm:left-2/4 sm:-translate-x-2/4 sm:-translate-y-2/4 cat-container">
                            <h2 className="text-white uppercase">
                              {cat?.name}
                            </h2>
                            <p className="mt-5 font-light text-white">
                              {cat?.description}
                            </p>
                          </div>
                        </div>
                        <div className="order-1 sm:order-2">
                          <Image
                            src={
                              generateUri(cat?.url, 'h=700&fm=webp') ||
                              IMG_PLACEHOLDER
                            }
                            className="w-full"
                            alt={category?.name}
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
              <div className="py-4">
                <h2 className="container mx-auto mb-4 font-bold font-18">
                  Popular categories
                </h2>
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
                    (featurecat: any, cdx: number) => (
                      <>
                        <SwiperSlide key={cdx}>
                          <div className="relative group">
                            <div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30"></div>
                            <>
                              {featurecat?.image != '' ? (
                                <Image
                                  src={featurecat?.image}
                                  className="object-fill object-center w-full"
                                  alt="Image"
                                  width={240}
                                  height={160}
                                />
                              ) : (
                                <Image
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
                      </>
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
                          />
                        ) : (
                          <ProductFilterRight
                            handleFilters={handleFilters}
                            products={productDataToPass}
                            routerFilters={state.filters}
                          />
                        )}
                        <div className="sm:col-span-10 p-[1px]">
                          {isMobile ? null : (
                            <ProductFiltersTopBar
                              products={products}
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
                          />
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-12 p-[1px] sm:mt-4 mt-2">
                        <ProductGrid
                          products={productDataToPass}
                          currentPage={state?.currentPage}
                          handlePageChange={handlePageChange}
                          handleInfiniteScroll={handleInfiniteScroll}
                          deviceInfo={deviceInfo}
                          maxBasketItemsCount={maxBasketItemsCount(config)}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 py-8 mx-auto text-center sm:p-32 max-w-7xl">
                  <h4 className="text-3xl font-bold text-gray-300">
                    No Products availabe in {category?.name}
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
