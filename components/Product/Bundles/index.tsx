import { ChangeEvent, useState } from 'react'
import BundleCard from './BundleCard'

import { useTranslation } from '@commerce/utils/use-translation'
import ProductCard from '@components/ProductCard'

export default function Bundles({ onClose = () => { }, price = '',product, products = [], productBundleUpdate = () => { }, deviceInfo, onBundleAddToCart = () => { }, featureToggle, defaultDisplayMembership, }: any) {
  const translate = useTranslation()
  const [productData, setProductData] = useState(null)
  const handleProduct = (product: any) => {
    setProductData(product)
    if (productBundleUpdate) {
      productBundleUpdate(product)
    }
  }

  const getSizeSelection = (value: string, product: any) => {
    if (product && product?.stockCode) {
      const stockCode = product?.stockCode
      const productSize = stockCode.substring(stockCode.lastIndexOf('-') + 1)
      return productSize && productSize.toLowerCase() === value.toLowerCase()
    }
    return ''
  }

  const handleSizeChanged = (
    ev: ChangeEvent<HTMLSelectElement>,
    product: any
  ) => {
    //debugger
    const target = ev.target
    if (target && product) {
      const size = target.value
      if (size && product?.stockCode) {
        const stockCode = product?.stockCode
        product.stockCode = `${stockCode.substring(
          0,
          stockCode.lastIndexOf('-') + 1
        )}${size.toUpperCase()}`
        handleProduct(product)
      }
    }
  }

  const getProductColorHexCode = (product: any) => {
    if (
      product &&
      product?.customAttributes &&
      product?.customAttributes?.length
    ) {
      const colorAttr = product?.customAttributes.find(
        (attr: any) => attr?.key === 'global.colour'
      )
      if (colorAttr) {
        return colorAttr.value
      }
    }
    return '#FFFFFF'
  }

  const css = { maxWidth: '100%', minHeight: '350px' }
  return (
    <section aria-labelledby="bundle" className="container px-4 mx-auto sm:px-0" >
      <div className="flex items-center justify-between w-full p-0 mb-6 sm:mb-10">
        <h2 id="bundle" className="flex items-center text-2xl font-semibold md:text-3xl h2-heading-text">
          {translate('label.product.bundles.buyTogetherText')}<span className='sr-only'>{' '}of {product?.name}</span>
        </h2>
        <div className="flex gap-2">
          <span className="flex-col font-semibold text-right text-black text-md align-right item-right"> {translate('label.orderSummary.totalText')} </span>
          <span className="text-3xl font-bold text-right text-gray-900 align-right item-right"> {price} </span>
          <button className="flex items-center justify-center flex-1 px-4 py-2 ml-2 font-medium text-white uppercase bg-black border rounded-full sm:px-6 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full btn-c btn-primary button" onClick={onBundleAddToCart} >
            {translate('label.product.bundles.addBundleText')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product: any, productIdx: number) => (
          <div key={productIdx}>
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={0} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </div>
        ))}
      </div>

      {productData && (
        <BundleCard closeModal={() => handleProduct(null)} productData={productData} />
      )}
    </section>
  )
}
