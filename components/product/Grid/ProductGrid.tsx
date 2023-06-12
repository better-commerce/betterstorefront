import dynamic from 'next/dynamic'
import rangeMap from '@lib/range-map'
const ProductCard = dynamic(() => import('@components/product/ProductCard/ProductCard'))
const InfiniteScroll = dynamic(() => import('@components/ui/InfiniteScroll'))
const Pagination = dynamic(() => import('@components/product/Pagination'))
import { TITLE_PRODUCTS } from '@components/utils/textVariables'
import { IExtraProps } from '@components/common/Layout/Layout'

interface Props {
  products: any
  currentPage: number | string
  handlePageChange?: any
  handleInfiniteScroll: any
}

export default function CategoryGrid({
  products,
  currentPage,
  handlePageChange = () => { },
  handleInfiniteScroll,
  deviceInfo,
}: Props & IExtraProps) {
  const IS_INFINITE_SCROLL =
    process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

  return (
    <>
      {IS_INFINITE_SCROLL && (
        <InfiniteScroll fetchData={handleInfiniteScroll} className="w-full mx-auto overflow-hidden sm:pl-4" total={products.total} currentNumber={products.results.length}
          component={
            <div className={`p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-2 sm:mx-0 md:grid-cols-6 ${products.results.length < 6
              ? `lg:grid-cols-6` : 'lg:grid-cols-6'}`}>
              {!products.results.length && rangeMap(12, (i) => (
                <div key={i} className="mx-auto mt-20 rounded-md shadow-md w-60 h-72">
                  <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                    <div className="flex flex-col space-y-3">
                      <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                    </div>
                  </div>
                </div>
              ))}
              {products?.results?.map((product: any, productIdx: number) => (
                <ProductCard key={productIdx} product={product} deviceInfo={deviceInfo} />
              ))}
            </div>
          }
        />
      )}
      {!IS_INFINITE_SCROLL && (
        <>
          <div className={`p-[1px] border-gray-100 gap-x-4 gap-y-4 grid grid-cols-2 sm:mx-0 md:grid-cols-5 ${products.results.length < 6
            ? `lg:grid-cols-5` : 'lg:grid-cols-5'}`}>
            {!products.results.length && rangeMap(12, (i) => (
              <div key={i} className="mx-auto mt-20 rounded-md shadow-md w-60 h-72">
                <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                  <div className="flex flex-col space-y-3">
                    <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                  </div>
                </div>
              </div>
            ))}
            {products.results.map((product: any, productIdx: number) => (
              <ProductCard key={productIdx} product={product} deviceInfo={deviceInfo} />
            ))}
          </div>
          {products.pages > 1 && (
            <Pagination currentPage={currentPage} onPageChange={handlePageChange} pageCount={products.pages} />
          )}
        </>
      )}
    </>
  )
}
