import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Form from './form'
import axios from 'axios'
import { NEXT_API_PRICE_MATCH_ENDPOINT } from '@components//utils/constants'
import Image from 'next/image'
import { useTranslation } from '@commerce/utils/use-translation'

export default function PriceMatch({ show, onClose, productImage, productId, stockCode, productName, ourCost, ourDeliveryCost, rrp }: any) {
  const translate = useTranslation()
  const submitContactForm = (values: any) => {
    const priceMatch = {
      productId: productId,
      stockCode: stockCode,
      productName: productName,
      ourCost: ourCost,
      ourDeliveryCost: ourDeliveryCost,
      webSiteName: values.webSiteName,
      directLinkUrl: values.websiteLink,
      competitorCost: values.costOfProduct,
      competitorDeliveryCost: values.competitorDeliveryCost,
      competitorTotalCost: values.totalCost,
      customerName: values.name,
      customerEmail: values.email,
      customerTelephone: values.phone,
      isValid: true,
      email: values.email,
      rrp: rrp,
    }
    const submitContactFormAsync = async () => {
      await axios.post(NEXT_API_PRICE_MATCH_ENDPOINT, priceMatch)
      onClose(false)
    }
    submitContactFormAsync()
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => onClose(false)}
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
            <Dialog.Overlay className="fixed inset-0 hidden transition-opacity bg-gray-500 bg-opacity-75 md:block" />
          </Transition.Child>

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
              <div className="relative flex items-center w-full px-4 pb-8 overflow-hidden bg-white shadow-2xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute text-gray-400 top-4 right-4 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={() => onClose(false)}
                >
                  <span className="sr-only">{translate('common.label.closeText')}</span>
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
                <section className="flex py-10">
                  <div className="w-1/2 p-2 bg-gray-50">
                    <p className="py-5 font-bold text-justify text-black">
                    {translate('label.product.priceMatchDesriptionText')}
                    </p>
                    <Image
                      alt="product-Image"
                      src={productImage}
                      className="object-cover object-top h-96 w-96"
                    />
                    <p className="py-5 font-bold text-center text-black">
                      {productName}
                    </p>
                  </div>
                  <div className="w-1/2 px-5">
                    <p className="py-5 text-lg font-bold text-center text-black center">
                    {translate('label.contactPreferences.contactPreferencesHeadingText')}
                    </p>
                    <Form submitContactForm={submitContactForm} />
                  </div>
                </section>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
