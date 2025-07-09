import { useState, useEffect } from 'react'
import _ from 'lodash'
import Layout from '@components/Layout/Layout'
import Products from './Products'
import { useTranslation } from '@commerce/utils/use-translation'

export default function ProductCompare({
  products,
  deviceInfo,
  maxBasketItemsCount,
  featureToggle,
  defaultDisplayMembership,
}: any) {
  const [attributeNames, setAttributeNames] = useState([])
  const translate = useTranslation()
  useEffect(() => {
    let mappedAttribsArrStr = products.map((o: any) => o.attributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr.map((o: any) => o.display))
    setAttributeNames(mappedAttribsArrStr)
  }, [products])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 r-display-none">
      {products?.map((product: any, productIdx: number) => (
        <div key={`compare-product-${productIdx}`} className="flex flex-col w-full p-3 border border-gray-300 rounded">
          <Products
            product={product}
            hideWishlistCTA={true}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            attributesCount={attributeNames?.length || 0}
            featureToggle={featureToggle}
            defaultDisplayMembership={defaultDisplayMembership}
          />
        </div>
      ))}
    </div>
  )
}
ProductCompare.Layout = Layout