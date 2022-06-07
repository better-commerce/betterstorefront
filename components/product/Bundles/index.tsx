import ProductCard from '@components/product/ProductCard'
import { BUNDLE_TEXT, GENERAL_ADD_TO_BASKET, YOUR_BUNDLE_INCLUDE } from '@components/utils/textVariables'
import { useState } from 'react'
import BundleCard from './BundleCard'

export default function Bundles({ price = '', products = [] }: any) {
  const [productData, setProductData] = useState(null)

  const handleProduct = (product: any) => setProductData(product)

  return (
    <section
      aria-labelledby="bundles-heading"
      className="border-t border-gray-200 py-8 px-4 sm:px-0"
    >
      <h2
        id="bundles-heading"
        className="text-center text-xl font-bold text-gray-900"
      >
        {YOUR_BUNDLE_INCLUDE}
      </h2>
      <p className="text-center text-gray-900">
        {BUNDLE_TEXT}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex py-5">
          {products.map((product: any, productIdx: number) => {
            return (
              <div onClick={() => handleProduct(product)} key={productIdx}>
                <img
                  className="h-40 w-40 object-center object-cover"
                  src={product.image || product.images[0]?.image}
                />
              </div>
            )
          })}
        </div>
        <div className="flex sm:flex-col1 w-1/3 h-1/5 flex-col items-center justify-center">
          <p className="text-gray-900 text-3xl font-bold py-5">{price}</p>
          <button
            type="submit"
            onClick={() => {}}
            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
          >
            {GENERAL_ADD_TO_BASKET}
          </button>
        </div>
      </div>
      {productData && (
        <BundleCard
          closeModal={() => handleProduct(null)}
          productData={productData}
        />
      )}
    </section>
  )
}
