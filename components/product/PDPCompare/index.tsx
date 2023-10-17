import { useState } from 'react'
import _ from 'lodash'

import { PDP_BRAND_COMPARE } from '@components/utils/textVariables'
import ProductSlider from '../ProductSlider'
import CompareSelectionBar from '../ProductCompare/compareSelectionBar'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { useUI } from '@components/ui'

const PDPCompare = ({ pageConfig, name, products, deviceInfo, activeProduct, attributeNames, maxBasketItemsCount }: any) => {
  const { compareProductList } = useUI()
  const [isProductCompare, setProductCompare] = useState(false)

  const showCompareProducts = () => {
    setProductCompare(!isProductCompare)
  }

  return (
    <div className="container px-4 mx-auto page-container sm:px-4 md:px-6 lg:px-6 2xl:px-0">
      <ProductSlider config={{ newInCollection: products, limit: 20, }} products={products} deviceInfo={deviceInfo} activeProduct={activeProduct} attributeNames={attributeNames} maxBasketItemsCount={maxBasketItemsCount} />
      {/* {_.size(compareProductList) > 0 && (
        <CompareSelectionBar
          name={name}
          showCompareProducts={showCompareProducts}
          isCompare={isProductCompare}
          maxBasketItemsCount={maxBasketItemsCount(pageConfig)}
          closeCompareProducts={showCompareProducts}
          deviceInfo={deviceInfo}
        />
      )} */}
    </div>
  )
}

export default PDPCompare
