import { useTranslation } from '@commerce/utils/use-translation'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'

export default function ProductReturn({ isReturn, setReturn, data }: any) {
  const translate = useTranslation()
  return (
    <>
      <Transition.Root show={isReturn} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-999"
          onClose={() => setReturn(!isReturn)}
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
                            onClick={() => setReturn(!isReturn)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon
                              className="relative w-8 h-8 top-1"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      {data?.map((retur: any, rid: number) => (
                        <>
                          <div
                            className="p-6 overflow-y-auto bg-white"
                            key={rid}
                          >
                            <div className="flex flex-col">
                              <div className="flex-1">
                                <img
                                  alt="Return"
                                  src={`/assets/images/exchange.png`}
                                  width={115}
                                  height={90}
                                />
                              </div>
                              <div className="flex-1 mt-4">
                                <h3 className="text-2xl font-bold text-black">
                                  {retur.value} {translate('label.product.productSidebar.daysText')}
                                </h3>
                                <h3 className="text-2xl font-bold text-black">
                                 {translate('label.product.productSidebar.return&ExchangeText')}
                                </h3>
                              </div>
                              <div className="flex-1 mt-6">
                                <p className="text-sm font-normal text-black">
                                  {translate('label.product.productSidebar.returnDetailsText')}
                                </p>
                              </div>
                              <div className="flex-1 mt-4">
                                <p className="my-4 text-xs font-normal text-gray-400">
                                {translate('label.product.productSidebar.returnIsEligibleText')}
                                </p>
                                <p className="my-4 text-xs font-normal text-gray-400">
                                {translate('label.product.productSidebar.returnIsNotEligibleText')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
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
