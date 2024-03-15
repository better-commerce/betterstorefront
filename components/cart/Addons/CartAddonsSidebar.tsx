import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import CartAddonProducts from './CartAddonProducts'
import { translate } from '@components/services/localization'
export default function CartAddonsSidebar({
  addonProducts,
  isModalClose,
  closeModal,
  deviceInfo,
  maxBasketItemsCount,
}: any) {
  return (
    <Transition.Root show={isModalClose} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-99"
        onClose={() => closeModal()}
      >
        <div className="absolute inset-0 overflow-hidden z-99">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="w-full h-screen bg-black/60"
              onClick={() => closeModal()}
            />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-0">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-full max-w-md">
                <div className="flex flex-col h-full overflow-y-auto bg-white">
                  <div className="flex flex-col">
                    <div className="sticky top-0 z-10 flex items-center justify-between px-4 pt-6 mb-1 bg-white sm:px-6">
                      <Dialog.Title className="font-semibold text-black font-18 ">
                        <div>{translate('label.cart.youMayAlsoNeedText')}</div>
                      </Dialog.Title>
                      <div className="relative flex items-center ml-3 -top-1 outline-none-s">
                        <button
                          type="button"
                          className="p-2 -m-2 text-black border border-black rounded hover:text-orange-600 hover:border-orange-600 outline-none-s"
                          onClick={() => closeModal()}
                        >
                          <span className="sr-only">{translate('common.label.closePanelText')}</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {addonProducts?.length > 0 ? <div className="flex flex-col px-4 mt-6">
                    <CartAddonProducts
                      products={addonProducts || []}
                      deviceInfo={deviceInfo}
                      maxBasketItemsCount={maxBasketItemsCount}
                    />
                  </div> :
                    <div className="flex flex-col items-center justify-between w-full h-36 py-9 sm:mt-28">
                      <img
                        height="100"
                        width="100"
                        src="/assets/images/cart.jpg"
                        alt="cart"
                        className="text-center"
                      />
                      <p className="my-5 text-3xl font-semibold text-center text-black uppercase">
                        {translate('label.cart.noAddonProdText')} 
                      </p>
                      <button
                        type="button"
                        className="w-7/12 px-10 mx-auto text-center btn-primary"
                        onClick={() => closeModal()}
                      >
                        {translate('common.label.continueShoppingText')} 
                      </button>
                    </div>
                  }

                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
