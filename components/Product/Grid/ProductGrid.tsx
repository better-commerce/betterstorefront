import { useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import rangeMap from '@lib/range-map'
const ProductCard = dynamic(() => import('@components/ProductCard'))
const InfiniteScroll = dynamic(() => import('@components/ui/InfiniteScroll'))
import { IExtraProps } from '@components/Layout/Layout'
import Pagination from '../Pagination'
import { CURRENT_THEME } from '@components/utils/constants'

interface Props {
  readonly products: any
  readonly currentPage: number | string
  handlePageChange?: any
  handleInfiniteScroll: any
  readonly isCompared: any
  readonly featureToggle?: any
  readonly defaultDisplayMembership: any
}

export default function CategoryGrid({
  products,
  currentPage,
  handlePageChange = () => { },
  handleInfiniteScroll,
  deviceInfo,
  maxBasketItemsCount,
  isCompared,
  featureToggle,
  defaultDisplayMembership,
}: Props & IExtraProps) {
  const router = useRouter()
  const IS_INFINITE_SCROLL = process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
  useEffect(() => {
    const currentPage: any = router?.query?.currentPage
    if (currentPage) {
      handlePageChange({ selected: parseInt(currentPage) - 1 }, false)
    }
  }, [router?.query?.currentPage])

  let gridClass = 'lg:grid-cols-4'
  if (CURRENT_THEME == 'green') {
    gridClass = 'lg:grid-cols-5 product-card-4'
  }


  return (
    <>
      {IS_INFINITE_SCROLL && (
        <InfiniteScroll
          fetchData={handleInfiniteScroll}
          className="w-full mx-auto overflow-hidden sm:px-8"
          total={products.total}
          currentNumber={products?.results?.length}
          component={
            <div className={`p-[5px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-3 sm:px-0 ${products?.results?.length < 5 ? gridClass : gridClass}`} >
              {!products?.results?.length && rangeMap(12, (i) => (
                <div key={i} className="mx-auto mt-20 rounded-md shadow-md w-60 h-72" >
                  <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                    <div className="flex flex-col space-y-3">
                      <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                    </div>
                  </div>
                </div>
              ))}
              {products?.results?.map((product: any, productIdx: number) => (
                <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} key={`products-${productIdx}`} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
              ))}
            </div>
          }
        />
      )}
      {!IS_INFINITE_SCROLL && (
        <>
          <div className={`p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-0 sm:px-0 lg:px-4 2xl:px-0 grid-sm-4 ${products?.results?.length < 5 ? gridClass : gridClass}`} >
            {!products?.results?.length && rangeMap(12, (i) => (
              <div key={i} className="mx-auto mt-20 rounded-md shadow-md w-60 h-72" >
                <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                  <div className="flex flex-col space-y-3">
                    <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                  </div>
                </div>
              </div>
            ))}
            {products?.results?.map((product: any, productIdx: number) => (
              <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} key={`products-${productIdx}`} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
            ))}
          </div>

          {products.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={(page: any) => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, currentPage: page.selected + 1 },
                  },
                  undefined,
                  { shallow: true }
                )
              }}
              pageCount={products.pages}
            />
          )}
        </>
      )}
    </>
  )
}
