import { useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { useUI } from '@components/ui'
import CompareSelectionBar from '@components/Product/ProductCompare/compareSelectionBar'
import dynamic from 'next/dynamic'
import { useTranslation } from "@commerce/utils/use-translation";
const ProductGrid = dynamic(() => import('@components/Product/Grid'))
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

export default function ProductCollection({
  query = {},
  brandDetails,
  deviceInfo,
  maxBasketItemsCount,
  featureToggle, 
  defaultDisplayMembership,
  ...props
}: any) {
  const adaptedQuery = { ...query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const [isProductCompare, setProductCompare] = useState(false)
  const translate = useTranslation();
  const { isCompared } = useUI()
  const initialState = {
    ...DEFAULT_STATE,
    ...{
      filters: [
        {
          Key: 'brandNoAnlz',
          Value: brandDetails.name,
          IsSelected: true,
        },
      ],
      collectionId: props.recordId,
    },
  }

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
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
      },
    },
    error,
  } = useSwr(
    ['/api/catalog/products', { ...state, ...{ slug: props?.slug } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (IS_INFINITE_SCROLL) {
      if (
        data?.products?.currentPage !==
          productListMemory?.products?.currentPage ||
        data?.products?.total !== productListMemory?.products?.total
      ) {
        setProductListMemory((prevData: any) => {
          let dataClone = { ...data }
          if (state?.currentPage > 1) {
            dataClone.products.results = [
              ...prevData?.products?.results,
              ...dataClone?.products?.results,
            ]
          }
          return dataClone
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.products?.results?.length])

  const handleInfiniteScroll = () => {
    if (
      data.products.pages &&
      data.products.currentPage < data.products.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const handleSortBy = (payload: any) => {
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : data.products

  const showCompareProducts = () => {
    setProductCompare(true)
  }

  const closeCompareProducts = () => {
    setProductCompare(false)
  }
  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {state.filters[0]?.Value}
          </h1>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-500">
          {productDataToPass?.total} {translate('common.label.resultsText')} 
          </h1>
          <div
            dangerouslySetInnerHTML={{
              __html: brandDetails.description,
            }}
            className="px-5 py-10 mt-5 text-gray-900"
          />
        </div>
        {/* <div className="flex justify-end w-full max-w-3xl px-4 py-5 mx-auto text-center sm:px-6 lg:max-w-7xl lg:px-8">
          <ProductSort
            routerSortOption={state.sortBy}
            products={data.products}
            action={handleSortBy}
            featureToggle={featureToggle}
          />
        </div> */}
        <ProductGrid
          products={productDataToPass}
          currentPage={state.currentPage}
          handleInfiniteScroll={handleInfiniteScroll}
          deviceInfo={deviceInfo}
          maxBasketItemsCount={maxBasketItemsCount}
          isCompared={isCompared}
          featureToggle={featureToggle} 
          defaultDisplayMembership={defaultDisplayMembership}
        />
        {isCompared === 'true' && (
          <CompareSelectionBar
            name={state.filters[0]?.Value}
            showCompareProducts={showCompareProducts}
            products={productDataToPass}
            isCompare={isProductCompare}
            maxBasketItemsCount={maxBasketItemsCount}
            closeCompareProducts={closeCompareProducts}
            deviceInfo={deviceInfo}
          />
        )}
      </main>
    </div>
  )
}
