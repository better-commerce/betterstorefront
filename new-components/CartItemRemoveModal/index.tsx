// Base Imports
import React, { Fragment } from 'react'

// Component Imports
import { Dialog, Transition } from '@headlessui/react'
import { LoadingDots, useUI } from '@new-components/ui'

// Other Imports
import { isEligibleForFreeShipping } from '@framework/utils/app-util'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LoadingActionType } from '@new-components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

const CartItemRemoveModal = ({
    isOpen,
    closeModal,
    loadingAction,
    handleItem,
    itemClicked,
    handleWishList,
    setLoadingAction,
    config
}: any) => {
    const translate = useTranslation()
    const { cartItems } = useUI()
    let EligibleForFreeShipping = isEligibleForFreeShipping(config, cartItems?.grandTotal?.raw?.withTax)
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                open={isOpen}
                className="relative z-9999"
                onClose={closeModal}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-1s00"
                    enterFrom="opacity-0"
                    enterTo="opacity-30"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-30"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Dialog.Panel className="w-full max-w-md pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                                <Dialog.Title
                                    as="div"
                                    className="flex justify-between w-full px-6 py-3 text-lg font-medium leading-6 text-gray-900 border-b-2 shadow xsm:text-md border-gray-50"
                                >
                                    {EligibleForFreeShipping ? translate('label.orderSummary.loseDeliveryText') : translate('common.label.removeItemConfirmText')}
                                    {loadingAction === LoadingActionType.NONE && (
                                        <XMarkIcon
                                            className="w-5 h-5 text-gray-500 hover:text-gray-400"
                                            onClick={closeModal}
                                        ></XMarkIcon>
                                    )}
                                </Dialog.Title>
                                {/* <hr className="w-full my-2 shadow-md "></hr> */}
                                <p className="p-6 text-sm font-normal text-black">
                                    {translate('label.basket.cartItemRemoveText')}
                                </p>
                                <div className="flex items-center justify-around w-full px-6 mt-2">
                                    <button
                                        onClick={() => {
                                            setLoadingAction(LoadingActionType.REMOVE_ITEM)
                                            handleItem(itemClicked, 'delete')
                                        }}
                                        className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 "
                                    >
                                        {loadingAction === LoadingActionType.REMOVE_ITEM ? (
                                            <LoadingDots />
                                        ) : (
                                            <>{translate('common.label.removeText')}</>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CartItemRemoveModal