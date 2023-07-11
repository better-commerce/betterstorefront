import { useState } from 'react'
import _ from 'lodash'

import { PDP_BRAND_COMPARE } from '@components/utils/textVariables'
import ProductSlider from '../ProductSlider'
import CompareSelectionBar from '../ProductCompare/compareSelectionBar'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { useUI } from '@components/ui'

const PDPCompare = ({ pageConfig, name, products, deviceInfo }: any) => {
  const { compareProductList } = useUI()
  const [isProductCompare, setProductCompare] = useState(false)

  const showCompareProducts = () => {
    setProductCompare(!isProductCompare)
  }

  return (
    <div className="mt-4">
      <div className="sm:col-span-8">
        <div className="flex-1 pb-0 pr-4 sm:pb-4">
          <h2 className="mb-2 font-bold font-18 text-dark-brown">
            {PDP_BRAND_COMPARE}
          </h2>
        </div>
      </div>
      <div>
        <ProductSlider
          config={{
            newincollection: products,
            limit: 10,
          }}
          deviceInfo={deviceInfo}
        />
      </div>

      {_.size(compareProductList) > 0 && (
        <CompareSelectionBar
          name={name}
          showCompareProducts={showCompareProducts}
          isCompare={isProductCompare}
          maxBasketItemsCount={maxBasketItemsCount(pageConfig)}
          closeCompareProducts={showCompareProducts}
          deviceInfo={deviceInfo}
        />
      )}
    </div>
  )
}

export default PDPCompare
