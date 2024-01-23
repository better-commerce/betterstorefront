import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'

export default function ProductOffers({ isOffers, setOffers, data }: any) {
  return (
    <>
      <Transition.Root show={isOffers} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOffers(!isOffers)}
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
                    <div className="relative z-50 flex flex-col h-full bg-white shadow-xl cvv-mobile-position sm:bg-white mob-width-full">
                      <div className="relative z-10 px-6 py-2 border-b border-gray-200 sm:py-6 sm:px-6 sm:left-1 right-1 sm:relative top-1 ">
                        <div className="flex flex-col w-full">
                          <div className="w-full">
                            <button
                              type="button"
                              className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                              onClick={() => setOffers(!isOffers)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="relative w-6 h-6 sm:w-8 sm:h-8 sm:top-1"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                          <div className="w-full">
                            <h3 className="font-bold text-20 sm-text-16 text-gray-dark">
                              {' '}
                              Offer Details
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-50 flex flex-col h-full overflow-y-auto bg-white shadow-xl">
                        <div className="p-6 pt-1 overflow-y-auto">
                          <div className="flex flex-col">
                            {data ? (
                              <>
                                <div className="flex-1 image-container">
                                  <img
                                    alt="Offers"
                                    src={generateUri(data?.additionalInfo5,'h=196&webp')||IMG_PLACEHOLDER}
                                    width={318}
                                    height={196}
                                    className="image"
                                  />
                                </div>
                                <div className="flex-1 mt-6">
                                  <p className="text-sm font-normal text-black">
                                    <div
                                      className="text-sm font-normal leading-7 text-brown"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          data?.additionalInfo4 ||
                                          data?.additionalInfo4,
                                      }}
                                    />
                                  </p>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
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
