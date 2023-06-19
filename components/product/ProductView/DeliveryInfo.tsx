// Base Imports
import { useState } from 'react'

// Package Imports
import moment from 'moment'
import axios from 'axios'
import * as Yup from 'yup'

// Component Imports
import ProductWarranty from '../ProductSidebar/ProductWarranty'
import ProductReturn from '../ProductSidebar/ProductReturn'

// Other Imports
import { min } from 'lodash'
import { recordGA4Event } from '@components/services/analytics/ga4'
import Image from 'next/image'
import DeliveryMessage from './DeliveryMessage'

export const DELIVERY_FORM_ID = 'deliveryInfoForm'
export const DELIVERY_FORM_FIELDS = [
  {
    type: 'tel',
    name: 'deliveryPinCode',
    placeholder: 'Enter Pincode',
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
export default function DeliveryInfo({ product, grpData }: any) {
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
        className="mt-0 border-gray-200 sm:border-t sm:mt-2"
      >
        <div className="flex flex-col px-4 pt-0 pb-0 mt-0 sm:pb-6 sm:pt-2 sm:mt-2 sm:px-0">
          <DeliveryMessage product={product} />
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
                        <Image
                          src={`/assets/images/easy-return.png`}
                          width="30"
                          alt={replaceAttr?.value}
                        />
                        <div className="text-sm font-semibold text-black">
                          {replaceAttr?.value} Days Easy Return
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
                        <Image
                          src={`/assets/images/exchange.png`}
                          width="25"
                          alt={returnAttr?.value}
                        />
                        <div className="text-sm font-semibold text-black">
                          {returnAttr?.value} Days Easy Exchange
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
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
