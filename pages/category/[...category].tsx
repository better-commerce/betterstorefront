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
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { ALL_CATEGORY, BAD_URL_TEXT, IMG_PLACEHOLDER, RESULTS } from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import commerce from '@lib/api/commerce'
//import { BiUnlink } from "react-icons/bi";

const PAGE_TYPE = PAGE_TYPES.Category

export async function getStaticProps(context: any) {
  const slugName = Object.keys(context.params)[0]
  const slug = slugName + '/' + context.params[slugName].join('/')
  const category = await getCategoryBySlug(slug)
  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  if (category) {
    const categoryProducts = await getCategoryProducts(category.id)
    return {
      props: {
        category,
        products: categoryProducts,
        globalSnippets: infra?.snippets ?? [],
        snippets: category?.snippets ?? []
      },
      revalidate: 60,
    }
  } else
    return {
      props: {
        category,
        products: null,
        globalSnippets: infra?.snippets ?? [],
        snippets: category?.snippets ?? []
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

function CategoryPage({ category, products }: any) {
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
  } = useSwr(['/api/catalog/products', state], postData)

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
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
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
      <div className="container mx-auto py-10 text-center relative top-20">
        <h4 className="text-3xl font-medium text-gray-400 pb-6">
          {BAD_URL_TEXT}
          <Link href="/category">
            <a className="text-indigo-500 px-3">{ALL_CATEGORY}</a>
          </Link>
        </h4>
      </div>
    )
  }

  const productDataToPass =
    IS_INFINITE_SCROLL && productListMemory.products?.results?.length
      ? productListMemory.products
      : products

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-0">
        <div className="sm:max-w-7xl sm:px-7 mx-auto sm:mt-4 mt-0 flex justify-center items-center w-full">
          {
            category && category.images && category.images.length ? (
              <Swiper navigation={true} loop={true} className="mySwiper">
                {category.images.map((image: any, idx: number) => {
                  return (
                    <SwiperSlide key={idx}>
                      <Link href={image.link || '#'}>
                        <Image
                          layout='fixed'
                          width={1920}
                          height={460}
                          src={image.url || IMG_PLACEHOLDER}
                          alt={category.name}
                          className="cursor-pointer w-full h-48 sm:h-96 sm:max-h-96 object-center object-cover sm:rounded-md"
                        ></Image>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            ) : (
              <></>
            )
          }
        </div>
        <div className="text-center pt-6 mb-4 px-4 sm:px-6 lg:px-8">
          <h1 className="sm:text-4xl text-2xl font-extrabold tracking-tight text-gray-900">
            {category.name}
          </h1>
          <h2>{category.description}</h2>
          {!!products && (
            <h1 className="sm:text-xl text-md mt-2 font-bold tracking-tight text-gray-500">
              {products.total}{' '}{RESULTS}
            </h1>
          )}
        </div>
        <div className="sm:max-w-7xl sm:px-7 mx-auto grid grid-cols-1 sm:grid-cols-12">
          <div className="sm:col-span-12 border-t border-gray-200 py-2">
            <div className="flex w-full text-center align-center justify-center">
              {
                category && category.subCategories && category.subCategories.length ? (
                  category.subCategories.map((subcateg: any, idx: number) => {
                    return (
                      <Link href={'/' + subcateg.link} key={idx}>
                        <div className="flex justify-center text-center items-center flex-col px-2 cursor-pointer">
                          <Image
                            layout='fixed'
                            width={80}
                            height={80}
                            className="h-8 w-8 sm:h-20 sm:w-20 rounded-full image"
                            src={subcateg.image || IMG_PLACEHOLDER}
                            alt={subcateg.name}
                          ></Image>
                          <h4 className="min-h-40px text-gray-900 font-semibold text-sm">
                            {subcateg.name}
                          </h4>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <></>
                )
              }
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-12 grid-cols-1 gap-1 max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
          {!!products && (
            <>
              {/* {MOBILE FILTER PANEL SHOW ONLY IN MOBILE} */}

              <div className="sm:col-span-3 sm:hidden flex flex-col">
                <ProductMobileFilters
                  handleFilters={handleFilters}
                  products={products}
                  routerFilters={state.filters}
                  handleSortBy={handleSortBy}
                  clearAll={clearAll}
                  routerSortOption={state.sortBy}
                />
              </div>
              <div className="sm:col-span-3 sm:block hidden">
                <ProductFilterRight
                  handleFilters={handleFilters}
                  products={productDataToPass}
                  routerFilters={state.filters}
                />
              </div>
              <div className="sm:col-span-9">
                {/* {HIDE FILTER TOP BAR IN MOBILE} */}

                <div className="flex-1 sm:block hidden">
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
      </main>
      <NextSeo
        title={category.name}
        description={category.description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: category.metaKeywords,
          },
        ]}
        openGraph={{
          type: 'website',
          title: category.metaTitle,
          description: category.metaDescription,
          images: [
            {
              url: category.image,
              width: 800,
              height: 600,
              alt: category.name,
            },
          ],
        }}
      />
    </div>
  )
}

export default withDataLayer(CategoryPage, PAGE_TYPE)
