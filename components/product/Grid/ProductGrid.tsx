import Pagination from '@components/product/Pagination'
import rangeMap from '@lib/range-map'
import ProductCard from '@components/product/ProductCard/ProductCard'
import InfiniteScroll from '@components/ui/InfiniteScroll'
import { TITLE_PRODUCTS } from '@components/utils/textVariables'

interface Props {
  products: any
  currentPage: number | string
  handlePageChange?: any
  handleInfiniteScroll: any
}

export default function CategoryGrid({
  products,
  currentPage,
  handlePageChange = () => {},
  handleInfiniteScroll,
}: Props) {
  const IS_INFINITE_SCROLL =
    process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

  return (
    <section
      aria-labelledby="products-heading"
      className="max-w-7xl overflow-hidden sm:px-6 lg:px-8 mx-auto"
    >
      <h2 id="products-heading" className="sr-only">
        {TITLE_PRODUCTS}
      </h2>

      {IS_INFINITE_SCROLL && (
        <InfiniteScroll
          fetchData={handleInfiniteScroll}
          total={products.total}
          currentNumber={products.results.length}
          component={
            <div
              className={`-mx-px border-l border-t border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-4 ${
                products.results.length < 4
                  ? `lg:grid-cols-4`
                  : 'lg:grid-cols-4'
              }`}
            >
              {!products.results.length &&
                rangeMap(12, (i) => (
                  <div
                    key={i}
                    className="shadow-md w-60 h-72 rounded-md mx-auto mt-20"
                  >
                    <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
                      <div className="flex flex-col space-y-3">
                        <div className="w-full bg-gray-100 h-48 rounded-md "></div>
                        <div className="w-36 bg-gray-100 h-6 mt-40 rounded-md "></div>
                      </div>
                    </div>
                  </div>
                ))}
              {products.results.map((product: any, productIdx: number) => (
                <ProductCard key={productIdx} product={product} />
              ))}
            </div>
          }
        />
      )}
      {!IS_INFINITE_SCROLL && (
        <>
          <div className="-mx-px border-l border-t border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
            {!products.results.length &&
              rangeMap(12, (i) => (
                <div
                  key={i}
                  className="shadow-md w-60 h-72 rounded-md mx-auto mt-20"
                >
                  <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
                    <div className="flex flex-col space-y-3">
                      <div className="w-full bg-gray-100 h-48 rounded-md "></div>
                      <div className="w-36 bg-gray-100 h-6 mt-40 rounded-md "></div>
                    </div>
                  </div>
                </div>
              ))}
            {products.results.map((product: any, productIdx: number) => (
              <ProductCard key={productIdx} product={product} />
            ))}
          </div>
          {products.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageCount={products.pages}
            />
          )}
        </>
      )}
    </section>
  )
}
