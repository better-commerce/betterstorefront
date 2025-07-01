import { useEffect, useCallback, memo, useMemo } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import rangeMap from '@lib/range-map'
import { IExtraProps } from '@components/common/Layout/Layout'

// Optimize dynamic imports with loading priority
const ProductCard = dynamic(() => import('@components/ProductCard'), { ssr: true })
const InfiniteScroll = dynamic(() => import('@components/ui/InfiniteScroll'))
const Pagination = dynamic(() => import('@components/Product/Pagination'))

interface Props {
  products: any
  currentPage: number | string
  handlePageChange?: any
  handleInfiniteScroll: any
  isCompared: any
  featureToggle: any;
  defaultDisplayMembership: any;
}

function CategoryGrid({ products, currentPage, handlePageChange = () => { }, handleInfiniteScroll, deviceInfo, maxBasketItemsCount, isCompared, featureToggle, defaultDisplayMembership, }: Props & IExtraProps) {
  const IS_INFINITE_SCROLL = process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
  // Memoize the route change handler to prevent unnecessary re-renders
  const handleRouteChange = useCallback(() => {
    const currentPage: any = Router?.query?.currentPage
    if (currentPage) {
      handlePageChange({ selected: parseInt(currentPage) - 1 }, false)
    }
  }, [handlePageChange])

  useEffect(() => {
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [handleRouteChange])

  // Memoize the grid class to prevent recalculation on every render
  const gridClass = useMemo(() => {
    return `p-[5px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-3 sm:px-0 ${
      products?.results?.length < 5
        ? `lg:grid-cols-4`
        : featureToggle?.features?.enableForPCSite
          ? 'lg:grid-cols-5'
          : 'lg:grid-cols-4'
    }`
  }, [products?.results?.length, featureToggle?.features?.enableForPCSite])

  // Memoize the non-infinite scroll grid class
  const nonInfiniteGridClass = useMemo(() => {
    return `p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-1 sm:mx-0 md:grid-cols-2 px-0 sm:px-0 lg:px-4 2xl:px-0 grid-sm-4 ${
      products?.results?.length < 5
        ? `lg:grid-cols-4`
        : featureToggle?.features?.enableForPCSite
          ? 'lg:grid-cols-5'
          : 'lg:grid-cols-4'
    }`
  }, [products?.results?.length, featureToggle?.features?.enableForPCSite])

  // Memoize the pagination handler to prevent unnecessary re-renders
  const handlePagination = useCallback((page: any) => {
    Router.push(
      {
        pathname: Router.pathname,
        query: { ...Router.query, currentPage: page.selected + 1 },
      },
      undefined,
      { shallow: true }
    )
  }, [Router.pathname, Router.query])

  return (
    <>
      {IS_INFINITE_SCROLL && (
        <InfiniteScroll fetchData={handleInfiniteScroll} className="w-full mx-auto overflow-hidden sm:px-8" total={products.total} currentNumber={products?.results?.length}
          component={
            <div className={gridClass}>
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
          <div className={nonInfiniteGridClass}>
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
              onPageChange={handlePagination}
              pageCount={products.pages}
            />
          )}
        </>
      )}
    </>
  )
}

// Memoize the CategoryGrid component to prevent unnecessary re-renders
export default memo(CategoryGrid)