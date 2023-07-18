import { useState, useEffect, Fragment } from 'react'
import _ from 'lodash'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Layout } from '@components/common'
import { CLOSE_PANEL } from '@components/utils/textVariables'
import Products from './Products'

export default function ProductCompare({
  products,
  isCompare,
  closeCompareProducts,
  deviceInfo,
  maxBasketItemsCount,
}: any) {
  const [attributeNames, setAttributeNames] = useState([])

  useEffect(() => {
    let mappedAttribsArrStr = products.map((o: any) => o.attributes).flat()
    mappedAttribsArrStr = _.uniq(mappedAttribsArrStr.map((o: any) => o.display))
    setAttributeNames(mappedAttribsArrStr)
  }, [products])

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
                        Comparing {products?.length} Items
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
                  <div className="container py-2 mx-auto mt-2 sm:px-0 !max-h-[504px] sm:!max-h-[215px] md:!max-h-[215px] lg:!max-h-[70vh] 2xl:!max-h-[700px] overflow-y-auto custom-scroll">
                    <div className="grid lg:grid-cols-12 md:grid-cols-12 grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="md:col-span-2 sm:col-span-1">
                        <div className="flex flex-col items-start justify-start w-full text-left p-2">
                          <div className="sticky w-full top-0 z-10 flex flex-col bg-white sm:h-[220px] md:h-[430px] h-[520px] lg:h-[516px]"></div>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Ratings
                          </span>
                          <span className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg">
                            Brand
                          </span>
                          {attributeNames?.map((attribName: any) => (
                            <span
                              key={attribName}
                              className="flex items-center justify-start w-full pb-3 my-3 font-semibold text-left text-black uppercase font-lg"
                            >
                              {attribName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-10 sm:col-span-2">
                        <Swiper
                          spaceBetween={10}
                          slidesPerView={1.1}
                          navigation={false}
                          loop={false}
                          breakpoints={{
                            640: {
                              slidesPerView: 2.5,
                            },
                            768: {
                              slidesPerView: 2.5,
                            },
                            1024: {
                              slidesPerView: 5.2,
                            },
                          }}
                          className="mySwier grid grid-cols-5 gap-3"
                        >
                          {' '}
                          {products?.map((product: any, productIdx: number) => (
                              <div key={`compare-product-${productIdx}`}>
                                <SwiperSlide>
                                  <Products
                                    product={product}
                                    hideWishlistCTA={true}
                                    deviceInfo={deviceInfo}
                                    maxBasketItemsCount={maxBasketItemsCount}
                                  />
                                </SwiperSlide>
                              </div>
                            ))}
                        </Swiper>
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
