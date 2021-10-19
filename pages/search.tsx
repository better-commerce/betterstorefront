import { Layout } from '@components/common'
import Link from 'next/link'
import { useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { FilterIcon } from '@heroicons/react/solid'
import useSwr from 'swr'
import { getData } from '@components/utils/clientFetcher'
import { GetServerSideProps } from 'next'
import ProductGrid from '@components/product/Grid'
import ProductSort from '@components/product/ProductSort'
import ProductFilters from '@components/product/Filters'

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White' },
      { value: 'beige', label: 'Beige' },
      { value: 'blue', label: 'Blue' },
      { value: 'brown', label: 'Brown' },
      { value: 'green', label: 'Green' },
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'All New Arrivals' },
      { value: 'tees', label: 'Tees' },
      { value: 'crewnecks', label: 'Crewnecks' },
      { value: 'sweatshirts', label: 'Sweatshirts' },
      { value: 'pants-shorts', label: 'Pants & Shorts' },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: '2xl', label: '2XL' },
    ],
  },
]

const sortOptions = [
  { name: 'Most Popular', href: '?sortOrder=desc', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS: 'HANDLE_FILTERS',
}

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
}

const { SORT_BY, PAGE, SORT_ORDER, CLEAR, HANDLE_FILTERS } = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
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
      return { ...state, ...DEFAULT_STATE }
    case HANDLE_FILTERS:
      return { ...state, areFiltersOpen: payload }
    default:
      return state
  }
}

function Search({ query }: any) {
  const adaptedQuery = { ...query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  const initialState = {
    ...DEFAULT_STATE,
    ...adaptedQuery,
  }

  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const computedUrl = `/api/catalog/products/?currentPage=${state.currentPage}&sortBy=${state.sortBy}&sortOrder=${state.sortOrder}`
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
      },
    },
    error,
  } = useSwr(computedUrl, getData)

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

  const handleSortBy = (payload: any) => {
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }
  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Catalog
          </h1>
        </div>
        <ProductFilters products={data.products} handleSortBy={handleSortBy} />
        <ProductGrid
          products={data.products}
          currentPage={state.currentPage}
          handlePageChange={handlePageChange}
        />
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  }
}

export default Search

Search.Layout = Layout
