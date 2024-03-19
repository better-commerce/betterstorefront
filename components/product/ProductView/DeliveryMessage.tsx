// Base Imports
import React from 'react'

// Other Imports
import { stringFormat } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'

function DeliveryMessage({
  product,
  currencySymbol,
  freeShippingOverXValue,
}: any) {
  const translate = useTranslation()
  return (
    <div className="flex flex-col px-0 pt-0 pb-0 mt-0 sm:pb-6 sm:pt-2 sm:mt-2 sm:px-0">
      <h2 className="mb-2 font-bold text-primary font-18">{translate('label.product.freeDeliveryText')}</h2>
      {freeShippingOverXValue && (
        <p className="font-normal text-14 text-brown-light">
          {stringFormat(translate('common.message.orderDeliveryMsg'), {
            currencySymbol: currencySymbol,
            freeShippingOverXValue: freeShippingOverXValue,
          })}
        </p>
      )}
    </div>
  )
}

export default DeliveryMessage
