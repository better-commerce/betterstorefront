import { useReducer, useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getAllCategories, getCategoryBySlug } from '@framework/category'
import { getCategoryProducts } from '@framework/api/operations'
import ProductFilterRight from '@components/product/Filters/filtersRight'
import ProductMobileFilters from '@components/product/Filters'
import ProductFiltersTopBar from '@components/product/Filters/FilterTopBar'
import ProductGridWithFacet from '@components/product/Grid'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import NextHead from 'next/head'
import { postData } from '@components/utils/clientFetcher'
import {
  ALL_CATEGORY,
  BAD_URL_TEXT,
  IMG_PLACEHOLDER,
  RESULTS,
} from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import BreadCrumbs from '@components/ui/BreadCrumbs'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'
//import { BiUnlink } from "react-icons/bi";

const PAGE_TYPE = PAGE_TYPES.Category

export async function getStaticProps(context: any) {
  const slugName = Object.keys(context.params)[0]
  const slug = slugName + '/' + context.params[slugName].join('/')
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
    if (category.subCategories) {
      category.subCategories.forEach((i: any) => generateCategory(i))
    }
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

function CategoryPage({ category, slug, products, }: any) {
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
    ['/api/catalog/products', { ...state, ...{ slug: slug } }],
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

  useEffect(() => {
    if (category.id !== state.categoryId)
      dispatch({ type: SET_CATEGORY_ID, payload: category.id })
  }, [category.id])

  useEffect(() => {
    if (IS_INFINITE_SCROLL) {
      if (
        data?.products?.currentPage !== productListMemory.products.currentPage ||
        data?.products?.total !== productListMemory.products.total
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
  }, [data?.products?.results?.length])

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

  const productDataToPass =
    IS_INFINITE_SCROLL && productListMemory.products?.results?.length
      ? productListMemory.products
      : products

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" id="canonical" href={router.asPath} />
        <title>{category?.name}</title>
        <meta name="title" content={category?.name} />
        <meta name="description" content={category?.metaDescription} />
        <meta name="keywords" content={category?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={category?.name} key="ogtitle" />
        <meta property="og:description" content={category?.metaDescription} key="ogdesc" />
      </NextHead>
      <div className="mx-auto bg-transparent md:w-4/5">
        {/* Mobile menu */}
        <main className="pb-0">
          <div className="px-3 pt-2 sm:pt-4 sm:px-0">
            {category.breadCrumbs && (
              <BreadCrumbs
                items={category.breadCrumbs}
                currentProduct={category}
              />
            )}
          </div>
          <div className="flex items-center justify-center w-full sm:px-0">
            {category && category.images && category.images.length ? (
              <Swiper
                navigation={true}
                loop={true}
                className="mt-0 mySwiper sm:mt-4"
              >
                {category.images.map((image: any, idx: number) => {
                  return (
                    <SwiperSlide key={idx}>
                      <Link href={image.link || '#'}>
                        <Image
                          style={css}
                          width={1920}
                          height={460}
                          src={
                            generateUri(image.url, 'h=700&fm=webp') ||
                            IMG_PLACEHOLDER
                          }
                          alt={category.name}
                          className="object-cover object-center w-full h-48 cursor-pointer sm:h-96 sm:max-h-96"
                        ></Image>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            ) : (
              <></>
            )}
          </div>

          <div className="px-3 pt-3 pb-4 text-left sm:pt-1 sm:pb-6 sm:px-0">
            <h4>
              <span className="text-sm font-normal text-gray-500">
                Showing {products.total} {RESULTS}
              </span>
            </h4>
            <h1 className="text-xl font-semibold tracking-tight text-black sm:text-xl">
              {category.name}
            </h1>
            <h2 className="text-gray-500 sm:text-md">{category.description}</h2>
          </div>

          {category?.subCategories?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-12">
                <div className="grid grid-cols-2 py-2 mt-2 text-left border-t border-l border-r sm:grid-cols-5 bg-gray-50">
                  {category?.subCategories?.map((subcateg: any, idx: number) => {
                    return (
                      <Link href={'/' + subcateg.link} key={idx}>
                        <div className="flex flex-col text-center cursor-pointer">
                          <h4 className="text-xs font-medium text-gray-800 underline sm:text-sm hover:text-pink">
                            {subcateg.name}
                          </h4>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          {products.total > 0 && (
            <div className="grid w-full grid-cols-1 gap-1 mx-auto overflow-hidden sm:grid-cols-12 sm:border-t sm:border-gray-200">
              {!!products && (
                <>
                  {/* {MOBILE FILTER PANEL SHOW ONLY IN MOBILE} */}

                  <div className="flex flex-col sm:col-span-2 sm:hidden">
                    <ProductMobileFilters
                      handleFilters={handleFilters}
                      products={products}
                      routerFilters={state.filters}
                      handleSortBy={handleSortBy}
                      clearAll={clearAll}
                      routerSortOption={state.sortBy}
                    />
                  </div>
                  <div className="hidden sm:col-span-2 sm:block">
                    <ProductFilterRight
                      handleFilters={handleFilters}
                      products={productDataToPass}
                      routerFilters={state.filters}
                    />
                  </div>
                  <div className="px-4 overflow-hidden sm:col-span-10 sm:px-0">
                    {/* {HIDE FILTER TOP BAR IN MOBILE} */}

                    <div className="flex-1 hidden sm:block">
                      <ProductFiltersTopBar
                        products={products}
                        handleSortBy={handleSortBy}
                        routerFilters={state.filters}
                        clearAll={clearAll}
                        routerSortOption={state.sortBy}
                      />
                    </div>
                    <ProductGridWithFacet
                      products={productDataToPass}
                      currentPage={products.currentPage}
                      handlePageChange={handlePageChange}
                      handleInfiniteScroll={handleInfiniteScroll}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {products.total == 0 && (
            <div className="p-32 mx-auto text-center max-w-7xl">
              <h4 className="text-3xl font-bold text-gray-300">
                No Products availabe in {category.name}
              </h4>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default withDataLayer(CategoryPage, PAGE_TYPE)
