import { Layout } from '@components/common'
import { useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import { getData } from '@components/utils/clientFetcher'
import { GetServerSideProps } from 'next'
import ProductGrid from '@components/product/Grid'
import ProductFilters from '@components/product/Filters'

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
      return state
  }
}

function Search({ query }: any) {
  const adaptedQuery = { ...query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    ...adaptedQuery,
  }

  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const computedUrl = `/api/catalog/products/?currentPage=${
    state.currentPage
  }&sortBy=${state.sortBy}&sortOrder=${
    state.sortOrder
  }&filters=${JSON.stringify(state.filters)}`
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

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        filters: JSON.stringify(state.filters),
      },
    })
  }, [state.filters])
  const handleFilters = (filter: null, type: string) => {
    debugger
    dispatch({
      type,
      payload: filter,
    })
  }

  const clearAll = () => dispatch({ type: CLEAR })

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Catalog
          </h1>
        </div>
        <ProductFilters
          handleFilters={handleFilters}
          products={data.products}
          handleSortBy={handleSortBy}
          routerFilters={state.filters}
          clearAll={clearAll}
        />
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
