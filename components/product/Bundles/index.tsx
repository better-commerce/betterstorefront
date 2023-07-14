import { ChangeEvent, useState } from 'react'
import BundleCard from './BundleCard'
import {
  BUNDLE_TEXT,
  YOUR_BUNDLE_INCLUDE,
} from '@components/utils/textVariables'
import { ColorFilledSquare } from '@components/ui/ColorFilledSquare'
import Image from 'next/image'
import ProductCard from '../ProductCard/ProductCard'

export default function Bundles({
  price = '',
  products = [],
  productBundleUpdate = () => {},
  deviceInfo,
}: any) {
  const [productData, setProductData] = useState(null)
  const handleProduct = (product: any) => {
    setProductData(product)
    if (productBundleUpdate) {
      productBundleUpdate(product)
    }
  }

  const getSizeSelection = (value: string, product: any) => {
    if (product && product.stockCode) {
      const stockCode = product.stockCode
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
      if (size && product.stockCode) {
        const stockCode = product.stockCode
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
      product.customAttributes &&
      product.customAttributes.length
    ) {
      const colorAttr = product.customAttributes.find(
        (attr: any) => attr.key === 'global.colour'
      )
      if (colorAttr) {
        return colorAttr.value
      }
    }
    return '#FFFFFF'
  }
  const css = { maxWidth: '100%', minHeight: '350px' }
  return (
    <section
      aria-labelledby="bundle"
      className="container px-4 mx-auto sm:px-0"
    >
      <div className="flex items-center justify-between w-full p-0 mb-2">
        <h2 id="bundle" className="text-xl font-bold text-left text-gray-900">
          Buy together and save
        </h2>
        <div>
          <p className="font-semibold text-right text-black text-md flext-col align-right item-right">
            Total
          </p>
          <p className="flex flex-col pb-2 text-3xl font-bold text-right text-gray-900 align-right item-right">
            {price}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product: any, productIdx: number) => (
          <div key={productIdx}>
            <ProductCard
              product={product}
              deviceInfo={deviceInfo}
              maxBasketItemsCount={0}
            />
          </div>
        ))}
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
