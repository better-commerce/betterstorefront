import { useState } from 'react'
import BundleCard from './BundleCard'
import { useTranslation } from '@commerce/utils/use-translation'
import ProductCard from '@components/CompareProductCard'

export default function Bundles({ onClose = () => {}, price = '', products = [], productBundleUpdate = () => {}, deviceInfo, onBundleAddToCart = () => {},featureToggle, defaultDisplayMembership }: any) {
  const translate = useTranslation()
  const [productData, setProductData] = useState(null)
  const handleProduct = (product: any) => {
    setProductData(product)
    if (productBundleUpdate) {
      productBundleUpdate(product)
    }
  }

  return (
    <section aria-labelledby="bundle" className="container px-4 mx-auto sm:px-0" >
      <div className="flex items-center justify-between w-full p-0 mb-2 sm:mb-6">
        <h2 id="bundle" className="text-2xl font-semibold text-left text-gray-900 capitalize">
          {translate('label.product.bundles.buyTogetherText')}
        </h2>
        <div className="flex items-center gap-5">
          <span className="flex-col font-semibold text-right text-black text-md align-right item-right">
          {translate('label.product.orderSummary.totalText')}
          </span>
          <span className="flex flex-col text-2xl font-semibold text-right text-gray-900 align-right item-right">
            {price}
          </span>
          <button className="flex items-center justify-center flex-1 px-1 py-2 ml-2 font-medium text-white uppercase bg-black border rounded sm:px-10 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full btn-c btn-primary button" onClick={onBundleAddToCart} >
           {translate('label.product.bundles.addBundleText')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product: any, productIdx: number) => (
          <div key={productIdx}>
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={0} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership}            />
          </div>
        ))}
      </div>
      {productData && (
        <BundleCard closeModal={() => handleProduct(null)} productData={productData} />
      )}
    </section>
  )
}