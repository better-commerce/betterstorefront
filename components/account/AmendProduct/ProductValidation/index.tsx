import { Button } from '@components/ui'
import { NEXT_TRADE_IN_PRODUCT_BY_STOCKCODE, NEXT_TRADE_IN_UPDATE_PRODUCT_STOCKCODE, } from '@components/utils/constants'
import { callApi } from '@framework/utils/api-util'
import { logError } from '@framework/utils/app-util'
import { AxiosRequestConfig } from 'axios'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import React, { useCallback, useState } from 'react'
import { AssessmentSteps } from '../index'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import ProductSearch from './ProductSearch'

export default function ProductValidation({ product, setCurrentStep, currentStep, setCompletedSteps, assessmentId, setAssessmentData }: any) {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [displayProductSearchUI, setDisplayProductSearchUI] = useState<any>(false)

  const onCompleteProductValidation = useCallback(async (stockcode?: string, close?: any) => {
    try {
      setIsLoading(true)
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_UPDATE_PRODUCT_STOCKCODE, method: RequestMethod.PUT, data: { stockcode: stockcode || product?.parentStockCode, id: assessmentId  }, }
      const assessmentResult = await callApi(config)
      if (assessmentResult?.data) {
        const { data } = await callApi({ url: NEXT_TRADE_IN_PRODUCT_BY_STOCKCODE, method: RequestMethod.POST, data: { stockcode: stockcode || product?.parentStockCode }, })
        setAssessmentData((prev: any) => ({ ...prev, conditionsList: data?.conditions }))
        setCompletedSteps((prev: any) => ([...(prev || []), AssessmentSteps.PRODUCT_VALIDATION]))
        setCurrentStep(AssessmentSteps.PRODUCT_ACCESSORIES)
        setDisplayProductSearchUI(false)
        close?.()
      }
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="mx-auto w-full bg-white py-2 border border-slate-800">
        <Disclosure defaultOpen={currentStep === AssessmentSteps.PRODUCT_VALIDATION} as="div" className="w-full">
          {({ open, close }) => (
            <>
              <Disclosure.Button className="flex w-full text-[#212530] justify-between py-2 text-left text-sm font-medium  focus:outline-none border-b-2 border-black p-2">
                <span className="uppercase">Product validation</span>
                <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
              </Disclosure.Button>
              <Disclosure.Panel className="p-2 text-sm text-gray-500">
                <div className=" p-2 ">
                {displayProductSearchUI ? (
                  <ProductSearch onCloseProduct={setDisplayProductSearchUI} updateProductStockCode={(stockcode: any) => onCompleteProductValidation(stockcode, close)} />
                ) : (
                  <>
                    <p className="text-start"> {' '} Do you want to continue with the product <strong> {product?.parentProductName}</strong>?{' '} </p>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => onCompleteProductValidation('',close!)} className="btn btn-primary" disabled={isLoading}>{isLoading ? "Submitting" : "Yes"}</Button>
                      <Button onClick={() => setDisplayProductSearchUI(true)} className="btn btn-danger" disabled={isLoading}> No </Button>
                    </div>
                  </>
                )}
              </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
