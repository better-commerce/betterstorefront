import { Layout } from '@components/common'
import { CLOSE_PANEL } from '@components/utils/textVariables'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import Products from './Products'
export default function ProductCompare({
  products,
  isCompare,
  closeCompareProducts,
  deviceInfo,
  maxBasketItemsCount,
}: any) {
  return (
    <Transition.Root show={isCompare} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-999"
        onClose={() => closeCompareProducts()}
      >
        <div className="absolute inset-0 overflow-hidden z-999">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-0 sm:duration-0"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-0 sm:duration-0"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Overlay
              className="w-full h-screen bg-black opacity-50"
              onClick={() => closeCompareProducts()}
            />
          </Transition.Child>

          <div className="fixed inset-0 flex items-end justify-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-500"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-500"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="w-full mx-auto">
                <div className="flex flex-col h-full overflow-y-auto bg-white">
                  <div className="sticky top-0 z-10 flex items-start justify-between w-full px-6 py-7 bg-tan">
                    <div className="container flex items-center justify-between mx-auto">
                      <Dialog.Title className="flex items-center gap-5 text-lg font-medium uppercase">
                        <ArrowLeftIcon
                          onClick={() => closeCompareProducts()}
                          className="w-4 h-4 text-black"
                        />{' '}
                        Comparing 5 Items
                      </Dialog.Title>
                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          className="p-2 -m-2 text-gray-600 hover:text-gray-500"
                          onClick={() => closeCompareProducts()}
                        >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="container py-2 mx-auto mt-2 sm:px-0 max-h-[700px] overflow-y-auto custom-scroll">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="sm:col-span-2">
                        <div className="flex flex-col items-start justify-start w-full text-left">
                          <div className="sticky w-full top-0 z-10 flex flex-col bg-white h-[430px]"></div>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Ratings
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 1
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 2
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 3
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 4
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 5
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 6
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Feature 7
                          </span>
                        </div>
                      </div>
                      <div className="sm:col-span-10">
                        <div className="grid grid-cols-5 gap-3">
                          {products?.results
                            ?.slice(0, 5)
                            ?.map((product: any, productIdx: number) => (
                              <div key={`compare-product-${productIdx}`}>
                                <Products
                                  product={product}
                                  hideWishlistCTA={true}
                                  deviceInfo={deviceInfo}
                                  maxBasketItemsCount={maxBasketItemsCount}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
ProductCompare.Layout = Layout
