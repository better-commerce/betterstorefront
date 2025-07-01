import { Transition, Dialog } from '@headlessui/react'
import { AxiosRequestConfig } from 'axios'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Loader from '@components/Loader'
import ButtonClose from '@components/shared/ButtonClose/ButtonClose'
import { NEXT_TRADE_IN_GET_ASSESSMENT } from '@components/utils/constants'
import { callApi } from '@framework/utils/api-util'
import { logError } from '@framework/utils/app-util'
import ProductValidation from './ProductValidation'
import ProductAccessories from './ProductAccessories'

export enum AssessmentSteps {
  PRODUCT_VALIDATION = 'product_validation',
  PRODUCT_ACCESSORIES = 'product_accessories',
  PRODUCT_CHECKLIST = 'product_checklist',
}
export default function AmendProductModal({ open, onCloseAmendProduct, data }: any) {
  const { id, product} = useMemo(() => data, [data])
  const [isLoading, setIsLoading] = useState<any>(false)
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<string>(AssessmentSteps.PRODUCT_VALIDATION)

  const getAssessmentData = useCallback(async () => {
    setIsLoading(true)
    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_GET_ASSESSMENT, method: RequestMethod.POST, data: { id } };
      const assessmentResult = await callApi(config)
      if (assessmentResult?.data?.data) {
        setAssessmentData(assessmentResult?.data?.data)
      }
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => { getAssessmentData() }, [getAssessmentData])

  if (isLoading) return <Loader />
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 m-0 p-0" onClose={onCloseAmendProduct}>
        <div className="flex items-stretch justify-center h-full text-center m-0 p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
          </Transition.Child>

          <span className="inline-block align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
            <div className="fixed inset-0 w-screen h-screen z-[99999] bg-white dark:bg-white dark:text-slate-100 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center h-16 px-4 border-b">
                <p className="text-xl font-bold text-black">Amend Product: {product?.parentProductName}</p>
                <ButtonClose onClick={onCloseAmendProduct} />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto hiddenScrollbar p-4 gap-3">
                {(currentStep === AssessmentSteps.PRODUCT_VALIDATION || completedSteps?.includes(AssessmentSteps.PRODUCT_VALIDATION)) && <ProductValidation product={product} setCurrentStep={setCurrentStep} currentStep={currentStep} setCompletedSteps={setCompletedSteps} assessmentId={id} setAssessmentData={setAssessmentData} />}
                {(currentStep === AssessmentSteps.PRODUCT_ACCESSORIES || completedSteps?.includes(AssessmentSteps.PRODUCT_ACCESSORIES)) && <ProductAccessories product={product} setCurrentStep={setCurrentStep} currentStep={currentStep} setCompletedSteps={setCompletedSteps} assessmentId={id} assessmentData={assessmentData} onCloseAmendProduct={onCloseAmendProduct} />}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
