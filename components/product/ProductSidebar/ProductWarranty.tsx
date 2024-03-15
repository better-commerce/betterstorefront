import { translate } from '@components/services/localization'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'

export default function ProductWarranty({
  isWarranty,
  setWarranty,
  replaceValue,
}: any) {
  return (
    <>
      <Transition.Root show={isWarranty} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-999"
          onClose={() => setWarranty(!isWarranty)}
        >
          <div className="fixed inset-0 left-0 bg-orange-900/20" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none bottom-to-top">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-400"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-400"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                    <div className="relative z-50 flex flex-col h-full bg-white shadow-xl mobile-position sm:bg-white">
                      <div className="absolute z-10 px-4 py-6 sm:px-6 sm:left-1 right-1 sm:relative top-1 ">
                        <div className="flex justify-start">
                          <button
                            type="button"
                            className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                            onClick={() => setWarranty(!isWarranty)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon
                              className="relative w-8 h-8 top-1"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 overflow-y-auto bg-white">
                        <div className="flex flex-col">
                          {replaceValue['product.replacementeligibility']
                            ?.length && (
                            <div className="flex-1">
                              {replaceValue[
                                'product.replacementeligibility'
                              ]?.map((replaceAttr: any, rpdx: number) => (
                                <img
                                  alt={replaceAttr?.value || 'attribute'}
                                  key={`product-${rpdx}-replacement-image`}
                                  src={`/assets/icons/${replaceAttr?.value
                                    ?.toLowerCase()
                                    ?.replace(/ /g, '')}.svg`}
                                  width={115}
                                  height={90}
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex-1">
                            {replaceValue['product.replacementeligibility']
                              ?.length && (
                              <div className="flex-1">
                                {replaceValue[
                                  'product.replacementeligibility'
                                ]?.map((replaceText: any, rpdx: number) => (
                                  <h3
                                    className="text-2xl font-bold text-primary"
                                    key={`product-${rpdx}-replacement`}
                                  >
                                    {replaceText.value == '500 Day'
                                      ? '500 Days Replacement'
                                      : 'First Try Replacement'}
                                  </h3>
                                ))}
                              </div>
                            )}
                            <h3 className="text-2xl font-bold text-primary">
                            {translate('label.product.productSidebar.howToAvailRefundDescriptionText')}
                            </h3>
                          </div>
                          {replaceValue['product.replacementeligibility']
                            ?.length && (
                            <div className="flex-1">
                              {replaceValue[
                                'product.replacementeligibility'
                              ]?.map((replaceText: any, repdx: number) => (
                                <div
                                  className="w-full"
                                  key={`product-${repdx}-replacement-text`}
                                >
                                  {replaceText.value ==
                                  '30 Day 1st Try Guarantee' ? (
                                    <div className="w-full">
                                      <div className="flex-1 mt-6">
                                        <p className="text-sm font-normal text-black">
                                        {translate('label.product.productSidebar.guranteeDetailsText')}
                                        </p>
                                      </div>
                                      <div className="flex-1 mt-4">
                                        <p className="my-2 text-sm font-normal text-black">
                                          <b>
                                            {' '}
                                            {translate('label.product.productSidebar.isEligibleForGuranteeText')}{' '}
                                          </b>
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteePeriodReturnReasonText1')}{' '}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteePeriodReturnReasonText2')}{' '}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteePeriodReturnReasonText3')}
                                        </p>
                                        <p className="my-2 mt-4 text-sm font-normal text-black">
                                          <b>
                                            {' '}
                                            {translate('label.product.productSidebar.isNotEligibleForGuranteeText')}{' '}
                                          </b>
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteeNotEligibleReasonText1')}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteeNotEligibleReasonText2')}{' '}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.guranteeNotEligibleReasonText3')}
                                        </p>
                                        <p className="my-2 mt-4 text-sm font-normal text-black">
                                          <b> {translate('label.product.productSidebar.howToAvailRefundText')}</b>
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.howToAvailRefundDescriptionText')}{' '}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex-1 mt-6">
                                        <p className="text-sm font-normal text-black">
                                        {translate('label.product.productSidebar.warrantyNoteText')}
                                        </p>
                                      </div>
                                      <div className="flex-1 mt-4">
                                        <p className="my-2 text-sm font-normal text-black">
                                          <b>
                                            {' '}
                                            {translate('label.product.productSidebar.warrantyNotApplicableText')}
                                          </b>
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.warrantyNotApplicableReasonText1')}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.warrantyNotApplicableReasonText2')}:{' '}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.warrantyNotApplicableReasonText3')}
                                        </p>
                                        <p className="my-1 text-xs font-normal text-gray-400">
                                        {translate('label.product.productSidebar.headToFaqText')}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
