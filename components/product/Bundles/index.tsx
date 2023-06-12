import { ChangeEvent, useState } from 'react'
import BundleCard from './BundleCard'
import {
  BUNDLE_TEXT,
  YOUR_BUNDLE_INCLUDE,
} from '@components/utils/textVariables'
import { ColorFilledSquare } from '@components/ui/ColorFilledSquare'
import Image from 'next/image'

export default function Bundles({
  price = '',
  products = [],
  productBundleUpdate = () => {},
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
      className="px-4 pt-4 border-t border-gray-200 sm:px-0"
    >
      <h2 id="bundle" className="text-3xl font-bold text-center text-gray-900">
        {YOUR_BUNDLE_INCLUDE}
      </h2>
      <p className="text-sm text-center text-gray-400">{BUNDLE_TEXT}</p>
      <div className="flex items-center justify-between mt-3">
        {products.map((product: any, productIdx: number) => (
          <div
            key={`bundle-product-${productIdx}`}
            className="grid content-center grid-cols-12 p-3 border border-gray-200 rounded-md gap-x-2 align-center hover:border-indigo-200"
          >
            <div
              onClick={() => handleProduct(product)}
              className="col-span-4 cursor-pointer image-container"
            >
              <Image
                src={product.image || product.images[0]?.image}
                width={400}
                height={500}
                style={css}
                alt={product.name}
                className="object-cover object-center mx-auto rounded-md image"
              />
            </div>
            <div className="col-span-8">
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold text-gray-400">
                  {product.brand}
                </h3>
                <h3
                  onClick={() => handleProduct(product)}
                  className="mt-1 text-sm font-semibold text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {product.name}
                </h3>
                <h4 className="mt-1 text-sm">
                  <span className="inline-block text-xs font-bold uppercase tex-black">
                    SKU:
                  </span>
                  <span className="inline-block pl-1 text-gray-600">
                    {product.stockCode}
                  </span>
                </h4>
                <h4 className="mt-2 text-sm text-black">
                  <span className="inline-block font-semibold">
                    {product.price.formatted.withoutTax}
                  </span>
                  {product.listPrice.raw.withoutTax > 0 ? (
                    <span className="inline-block pl-3 text-xs font-semibold text-red-400 line-through">
                      {product.listPrice.formatted.withoutTax}
                    </span>
                  ) : null}
                </h4>
                <h4 className="mt-1 text-sm">
                  <span className="inline-block text-xs font-bold uppercase tex-black">
                    Colour:
                  </span>
                  <span className="inline-block pl-1 text-gray-600">
                    <ColorFilledSquare
                      width={10}
                      height={10}
                      bgColor={getProductColorHexCode(product)}
                    />
                  </span>
                </h4>
              </div>
              {product.variantAttributes.map((attribute: any, aid: number) => {
                attribute.fieldName == 'Size' ? (
                  <div className="flex flex-col mt-1" key={aid}>
                    <label className="text-sm font-semibold text-black">
                      {attribute.fieldName}:
                    </label>
                    <select
                      className="p-2 text-sm font-semibold text-black uppercase border border-gray-400 rounded-sm"
                      onChange={(ev) => handleSizeChanged(ev, product)}
                    >
                      {attribute.fieldValues.map((size: any, vdx: number) => (
                        <option
                          className="uppercase"
                          key={vdx}
                          value={size.fieldValue}
                          selected={getSizeSelection(size.fieldValue, product)}
                        >
                          {size.fieldValue}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-end p-3 border border-gray-100 rounded-md bg-gray-50 items-right">
        <p className="font-semibold text-right text-black text-md flext-col align-right item-right">
          Bundle Price
        </p>
        <p className="flex flex-col pb-2 text-3xl font-bold text-right text-gray-900 align-right item-right">
          {price}
        </p>
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
