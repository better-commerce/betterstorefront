import Link from 'next/link'
export default function RelatedProducts({
  relatedProducts = [],
  relatedProductList = [],
}: any) {
  const computeRelatedItems = () => {
    const relatedProductsClone = [...relatedProducts]

    return relatedProductList.reduce((acc: any, obj: any) => {
      acc.forEach((item: any) => {
        if (item.stockCode === obj.stockCode) {
          item.relatedProducts = obj
          item.relatedProducts
            ? (item.relatedProducts = [obj])
            : (item.relatedProducts = [...item.relatedProducts, obj])
        }
      })
      return acc
    }, relatedProductsClone)
  }

  const computedItems = computeRelatedItems()
  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-gray-200 py-8 px-4 sm:px-0"
    >
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        Customers also bought
      </h2>
      <div>
        {computedItems.map((relatedItem: any) => {
          return (
            <>
              <h2
                id="related-heading"
                className="text-xl mt-6 font-bold text-gray-900"
              >
                {relatedItem.name}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                {relatedItem.relatedProducts.map((product: any) => (
                  <div key={product.id}>
                    <div className="relative">
                      <div className="relative w-full h-72 rounded-lg overflow-hidden">
                        <Link href={`/${product.slug}`} passHref>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </Link>
                      </div>
                      <div className="relative mt-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link href={`/${product.slug}`} passHref>
                            <a href={`/${product.slug}`}>{product.name}</a>
                          </Link>
                        </h3>
                        {/* <p className="mt-1 text-sm text-gray-500">
                {product.color}
              </p> */}
                      </div>
                      <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                        />
                        <p className="relative text-lg font-semibold text-white">
                          {product.price.formatted.withTax}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href={`/${product.slug}`} passHref>
                        <a
                          href={product.slug}
                          className="relative flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
                        >
                          Add to bag
                          <span className="sr-only">, {product.name}</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        })}
      </div>
    </section>
  )
}
