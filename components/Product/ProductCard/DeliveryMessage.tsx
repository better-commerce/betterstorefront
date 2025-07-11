import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

//

import { NEXT_GET_PRODUCT } from '@components/utils/constants'

interface IDeliveryMessageProps {
  product: any
  freeShippingOverXValue: number
}

function DeliveryMessage({ product, freeShippingOverXValue }: IDeliveryMessageProps) {
  const [productData, setProductData] = useState(product)

  useEffect(() => {
    onProductData()
  }, [product])

  const onProductData = useCallback(async () => {
    const productSlug = product?.slug || product?.link
    if (!productSlug) return
    if (productSlug) {
      const slug = productSlug?.replace('products/', '')
      try {
        const response: any = await axios.post(NEXT_GET_PRODUCT, {
          slug,
        })
        if (response?.data?.product) {
          setProductData(response?.data?.product)
        }
      } catch (error) { }
    }
  }, [product])

  return (
    productData && (
      <div className="flex flex-col px-0 pt-0 pb-0 mt-0 sm:px-0 dark:text-black timer-p-font-sm">
       
      </div>
    )
  )
}

export default DeliveryMessage
