// Base Imports
import { useState } from 'react'

// Package Imports
import Cookies from 'js-cookie'

// Component Imports
import DeliveryMessage from './DeliveryMessage'
import ProductWarranty from '../ProductSidebar/ProductWarranty'
import ProductReturn from '../ProductSidebar/ProductReturn'

// Other Imports
import { recordGA4Event } from '@components/services/analytics/ga4'
import { stringToBoolean } from '@framework/utils/parse-util'
import { BETTERCOMMERCE_CURRENCY, BETTERCOMMERCE_DEFAULT_CURRENCY, EmptyString } from '@components/utils/constants'
import { Cookie } from '@framework/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

export const DELIVERY_FORM_ID = 'deliveryInfoForm'
export const DELIVERY_FORM_FIELDS = [
  {
    type: 'tel',
    name: 'deliveryPinCode',
    placeholder: translate('label.product.enterPincode'),
    showLabel: false,
    label: 'Pincode',
    className:
      'px-3 py-4 text-sm font-normal text-black border bg-zinc-100 border-zinc-100 placeholder:text-gray-400 hover:border-gray-900',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
    max: 6,
    min: 6,
    handleChange: (e: any, item: any, context: any) => {
      const regex = /^[0-9\s]*$/
      if (regex.test(e?.target.value.toString())) {
        context.setFieldValue(DELIVERY_FORM_FIELDS[0]?.name, e.target.value)
      }
    },
  },
]
export default function DeliveryInfo({ product, grpData, config }: any) {
  const translate = useTranslation()
  const [isWarranty, setWarranty] = useState(false)
  const [isReturn, setReturn] = useState(false)
  const [edd, setEDD] = useState<string | undefined>(undefined)
  const [replaceValue, replaceInfo] = useState(grpData)
  const handleClick = (grpData: any) => () => {
    replaceInfo(grpData)
    setWarranty(true)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'policy_popup', {
        current_page: 'PDP',
        category: 'Warranty',
      })
    }
  }

  const handleReturn = () => {
    setReturn(true)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'policy_popup', {
        current_page: 'PDP',
        category: 'Easy Returns & Exchange',
      })
    }
  }
  const shippingSettings = config?.configSettings?.find(
    (x: any) => x.configType === 'ShippingSettings'
  )
  const isFreeShippingOverXEnabled = stringToBoolean(
    shippingSettings?.configKeys?.find(
      (x: any) => x.key === 'ShippingSettings.FreeShippingOverXEnabled'
    )?.value || EmptyString
  )
  const freeShippingOverXValue =
    shippingSettings?.configKeys?.find(
      (x: any) => x.key === 'ShippingSettings.FreeShippingOverXValue'
    )?.value || '0'

  const getCurrencySymbol = () => {
    const currency =
      Cookies.get(Cookie.Key.CURRENCY) ||
      BETTERCOMMERCE_CURRENCY ||
      BETTERCOMMERCE_DEFAULT_CURRENCY
    return (
      config?.currencies?.find((x: any) => x?.currencyCode === currency)
        ?.currencySymbol || EmptyString
    )
  }

  let returnEligeble = ''
  let refundEligeble = ''

  if (grpData['product.returnexchangeeligibility']?.length > 0) {
    const data = grpData['product.returnexchangeeligibility'].find(
      (x: any) => x.value
    )
    returnEligeble = data?.value
  }

  if (grpData['product.returnexchangeeligibility']?.length > 0) {
    const data = grpData['product.returnexchangeeligibility'].find(
      (x: any) => x.value
    )
    refundEligeble = data?.value
  }

  return (
    <>
      <div className="flex flex-col sm:hidden">
        <div className="section-devider"></div>
      </div>
      <section
        aria-labelledby="details-heading"
        className="mt-0"
      >
        {isFreeShippingOverXEnabled && (
          <DeliveryMessage
            product={product}
            currencySymbol={getCurrencySymbol()}
            freeShippingOverXValue={freeShippingOverXValue}
          />
        )}

        {(grpData['product.exchangeeligibilitydays']?.length ||
          grpData['product.returneligibilitydays']?.length) && (
          <div className="flex flex-col px-0 pt-0 pb-0 mt-0 sm:pb-6 sm:pt-2 sm:mt-2 sm:px-0">
            <div className="grid grid-cols-2 mt-6 gap-x-4">
              {grpData['product.exchangeeligibilitydays']?.length &&
                returnEligeble == 'True' && (
                  <div
                    className="flex flex-col items-center content-center cursor-pointer align-center"
                    onClick={handleClick(grpData)}
                  >
                    {grpData['product.exchangeeligibilitydays']?.map(
                      (replaceAttr: any, rpdx: number) => (
                        <div
                          key={`product-${rpdx}-delivery`}
                          className="flex items-center justify-start w-full gap-2 text-left"
                        >
                          <img
                            src={`/assets/images/easy-return.png`}
                            width="30"
                            height={30}
                            alt={replaceAttr?.value || 'Easy Return'}
                          />
                          <div className="text-sm font-semibold text-black">
                            {replaceAttr?.value} {translate('label.product.daysEasyReturn')}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              {grpData['product.returneligibilitydays']?.length &&
                refundEligeble == 'True' && (
                  <div
                    className="flex items-center content-center cursor-pointer align-center"
                    onClick={() => handleReturn()}
                  >
                    {grpData['product.returneligibilitydays']?.map(
                      (returnAttr: any, rdx: number) => (
                        <div
                          key={`product-${rdx}-edd-return`}
                          className="flex items-center justify-start w-full gap-2 text-left"
                        >
                          <img
                            src={`/assets/images/exchange.png`}
                            width="25"
                            height={30}
                            alt={returnAttr?.value}
                          />
                          <div className="text-sm font-semibold text-black">
                            {returnAttr?.value} {translate('label.product.daysEasyExchange')}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </section>
      <ProductWarranty
        isWarranty={isWarranty}
        setWarranty={setWarranty}
        replaceValue={replaceValue}
      />
      <ProductReturn
        isReturn={isReturn}
        setReturn={setReturn}
        data={grpData['product.returneligibilitydays']}
      />
    </>
  )
}
