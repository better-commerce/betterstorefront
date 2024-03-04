import { useEffect } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { IExtraProps } from '@components/common/Layout/Layout'
import rangeMap from '@lib/range-map'
const ProductCard = dynamic(() => import('@components/product/ProductCard/ProductCard'))
const InfiniteScroll = dynamic(() => import('@components/ui/InfiniteScroll'))
const Pagination = dynamic(() => import('@components/product/Pagination'))
interface Props {
  products: any
  currentPage: number | string
  handlePageChange?: any
  handleInfiniteScroll: any
  isCompared: any
}

export default function Grid({ products, currentPage, handlePageChange = () => {}, handleInfiniteScroll,
  deviceInfo, maxBasketItemsCount, isCompared }: Props & IExtraProps) {
  const IS_INFINITE_SCROLL =
    process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      const currentPage: any = Router?.query?.currentPage
      if (currentPage) {
        handlePageChange({ selected: parseInt(currentPage) - 1 }, false)
      }
    })

    return () => {
      Router.events.off('routeChangeComplete', () => {})
    }
  }, [Router.events])

  return (
    <>
      {IS_INFINITE_SCROLL && (
        <InfiniteScroll
          fetchData={handleInfiniteScroll}
          className="w-full mx-auto overflow-hidden sm:pl-4"
          total={products.total}
          currentNumber={products.results.length}
          component={
            <div
              className={`p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-3 sm:px-4 ${
                products.results.length < 5
                  ? `lg:grid-cols-4`
                  : 'lg:grid-cols-4'
              }`}
            >
              {!products.results.length &&
                rangeMap(12, (i) => (
                  <div
                    key={i}
                    className="mx-auto mt-20 rounded-md shadow-md w-60 h-72"
                  >
                    <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                      <div className="flex flex-col space-y-3">
                        <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                      </div>
                    </div>
                  </div>
                ))}
              {products?.results?.map((product: any, productIdx: number) => (
                <ProductCard
                  key={productIdx}
                  product={product}
                  deviceInfo={deviceInfo}
                  maxBasketItemsCount={maxBasketItemsCount}
                />
              ))}
            </div>
          }
        />
      )}
      {!IS_INFINITE_SCROLL && (
        <>
          <div
            className={`p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-3 sm:px-4 ${
              products.results.length < 6 ? `lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4` : 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'
            }`}
          >
            {!products?.results?.length &&
              rangeMap(12, (i) => (
                <div
                  key={i}
                  className="mx-auto mt-20 rounded-md shadow-md w-60 h-72"
                >
                  <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                    <div className="flex flex-col space-y-3">
                      <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                    </div>
                  </div>
                </div>
              ))}
            {products.results.map((product: any, productIdx: number) => (
              <ProductCard
                key={productIdx}
                product={product}
                deviceInfo={deviceInfo}
                maxBasketItemsCount={maxBasketItemsCount}
              />
            ))}
          </div>

          {/*{products?.currentPage < products?.pages && (
            <div className="flex justify-center flex-1 mx-auto">
              <button
                className="px-6 py-2 my-6 font-semibold text-center text-gray-700 bg-gray-100 border border-gray-200 text-14 hover:bg-gray-800 hover:text-white"
                onClick={() => handleInfiniteScroll()}
              >
                Load More
              </button>
            </div>
          )}*/}
          {products.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              //onPageChange={handlePageChange}
              onPageChange={(page: any) => {
                Router.push(
                  {
                    pathname: Router.pathname,
                    query: { ...Router.query, currentPage: page.selected + 1 },
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
