// Base Imports
import React from 'react'

// Other Imports
import { stringFormat } from '@framework/utils/parse-util'
import { PRODUCT_DELIVERY_MESSAGE } from '@components/utils/textVariables'

function DeliveryMessage({
  product,
  currencySymbol,
  freeShippingOverXValue,
}: any) {
  return (
    <div className="flex flex-col px-0 pt-0 pb-0 mt-0 sm:pb-6 sm:pt-2 sm:mt-2 sm:px-0">
      <h2 className="mb-2 font-bold text-primary font-18">Free Delivery</h2>
      {freeShippingOverXValue && (
        <p className="font-normal text-14 text-brown-light">
          {stringFormat(PRODUCT_DELIVERY_MESSAGE, {
            currencySymbol: currencySymbol,
            freeShippingOverXValue: freeShippingOverXValue,
          })}
        </p>
      )}
    </div>
  )
}

export default DeliveryMessage
