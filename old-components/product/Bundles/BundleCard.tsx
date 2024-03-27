import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@commerce/utils/use-translation'

export default function BundleCard({ productData, closeModal }: any) {
  const translate = useTranslation()
  const [activeImage, setActiveImage] = useState(
    productData?.image || productData?.images[0]?.image
  )
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div
          className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 hidden transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="flex w-full text-base text-left transition transform md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
              <div className="relative flex items-center w-full px-4 pb-8 overflow-hidden bg-white shadow-2xl rounded-xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute text-gray-400 top-4 right-4 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={closeModal}
                >
                  <span className="sr-only">{translate('common.label.closeText')}</span>
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <div className="grid items-start w-full grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                  <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-2 aspect-h-3 sm:col-span-4 lg:col-span-5">
                    <Image
                      src={activeImage}
                      alt={productData.images[0]?.alt || "product-Images"}
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="sm:col-span-8 lg:col-span-7">
                  <div className='flex flex-col'>
                    <h3 className='text-xs font-semibold text-gray-400'>{productData?.brand}</h3>
                    <h3 className='text-2xl font-semibold text-gray-900 sm:pr-12'>{productData?.name}</h3>   
                    <h4 className='mt-1 text-sm'>
                        <span className='inline-block text-xs font-bold uppercase tex-black'>{translate('label.product.bundles.skuText')}:</span>
                        <span className='inline-block pl-1 text-gray-600'>{productData?.stockCode}</span>
                    </h4>
                    <h4 className='mt-2 text-sm text-black'>
                      <span className='inline-block font-semibold'>{productData?.price?.formatted?.withoutTax}</span>
                      <span className='inline-block pl-3 text-xs font-semibold text-red-400 line-through'>{productData?.listPrice?.formatted?.withoutTax}</span>
                    </h4>
                  </div>

                    <section
                      aria-labelledby="information-heading"
                      className="mt-2"
                    >
                      <h3 id="information-heading" className="sr-only">
                        {translate('label.product.bundles.productInformationText')}
                      </h3>
                    </section>
                    <div className="mt-6">
                      <h3 className="sr-only">{translate('label.product.bundles.descriptionText')}</h3>

                      <div
                        className="space-y-6 text-sm text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: productData.description,
                        }}
                      />
                    </div>
                    <section
                      aria-labelledby="options-heading"
                      className="mt-6"
                    >
                      <h3 id="options-heading" className="sr-only">
                      {translate('label.product.bundles.optionsText')}

                      </h3>
                      <div className="flex justify-between w-1/2">
                        {productData?.images.map(
                          (image: any, imageIdx: number) => {
                            return (
                              <Image
                                key={imageIdx}
                                className="object-cover object-center w-16 h-16 p-1 border rounded-md"
                                src={image?.image}
                                alt={image?.alt||'bundle-Image'}
                                onClick={() => setActiveImage(image?.image)}
                              />
                            )
                          }
                        )}
                      </div>
                      <form>
                        <Link href={`/${productData?.link}`}>
                          <button
                            type="submit"
                            className="flex items-center justify-center w-full px-8 py-3 mt-6 font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {translate('label.product.bundles.seeMoreText')}
                          </button>
                        </Link>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
