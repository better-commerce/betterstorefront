// Base Imports
import React, { Fragment } from 'react'

// Component Imports
import { Dialog, Transition } from '@headlessui/react'
import { LoadingDots, useUI } from '@components/ui'

// Other Imports
import { isEligibleForFreeShipping } from '@framework/utils/app-util'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { BTN_MOVE_TO_WISHLIST, FREE_SHIPPING_CART_ITEM_REMOVE_TILE, GENERAL_REMOVE, GENERAL_REMOVE_ITEM } from '@components/utils/textVariables'
import { LoadingActionType } from '@components/utils/constants'

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
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-30"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-30"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
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
                                    {EligibleForFreeShipping ? FREE_SHIPPING_CART_ITEM_REMOVE_TILE : GENERAL_REMOVE_ITEM}
                                    {loadingAction === LoadingActionType.NONE && (
                                        <XMarkIcon
                                            className="w-5 h-5 text-gray-500 hover:text-gray-400"
                                            onClick={closeModal}
                                        ></XMarkIcon>
                                    )}
                                </Dialog.Title>
                                {/* <hr className="w-full my-2 shadow-md "></hr> */}
                                <p className="p-6 text-sm font-normal text-black">
                                    Are you sure you don't want this product? You
                                    may move it to Wishlist and buy later.
                                </p>
                                <div className="flex items-center justify-around w-full px-6 mt-2">
                                    <button
                                        onClick={() => {
                                            setLoadingAction(LoadingActionType.REMOVE_ITEM)
                                            handleItem(itemClicked, 'delete')
                                        }}
                                        className="flex items-center justify-center w-full px-6 py-3 mx-3 text-sm font-semibold text-red-700 uppercase bg-white border border-gray-300 shadow-sm lg:text-md hover:bg-gray-100 md:w-full"
                                    >
                                        {loadingAction === LoadingActionType.REMOVE_ITEM ? (
                                            <LoadingDots />
                                        ) : (
                                            <>{GENERAL_REMOVE}</>
                                        )}
                                    </button>
                                    {/* <button
                                        onClick={() => {
                                            setLoadingAction(LoadingActionType.MOVE_TO_WISHLIST)
                                            handleWishList(itemClicked)
                                        }}
                                        className="flex items-center justify-center w-full h-16 px-6 py-2 mx-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 md:w-full"
                                    >
                                        {loadingAction === LoadingActionType.MOVE_TO_WISHLIST ? (
                                            <LoadingDots />
                                        ) : (
                                            <>{BTN_MOVE_TO_WISHLIST}</>
                                        )}
                                    </button> */}
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