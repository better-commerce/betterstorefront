// Base Imports
import React, { Fragment } from 'react'

// Component Imports
import { Dialog, Transition } from '@headlessui/react'
import { LoadingDots } from '@components/ui'

// Other Imports
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LoadingActionType } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

const DeleteBasketModal = ({ isOpen, closeModal, loadingAction, handleDeleteBasket, setLoadingAction, }: any) => {
    const translate = useTranslation()
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
                            <Dialog.Panel className="w-full max-w-md pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="div"
                                    className="flex items-center justify-between w-full px-6 py-3 text-lg font-medium leading-6 text-gray-900 border-b-2 shadow xsm:text-md border-gray-50"
                                >
                                    {translate('label.b2b.basket.removeBasketHeadingText')}
                                    {loadingAction === LoadingActionType.NONE && (
                                        <XMarkIcon
                                            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-400"
                                            onClick={closeModal}
                                        ></XMarkIcon>
                                    )}
                                </Dialog.Title>
                                {/* <hr className="w-full my-2 shadow-md "></hr> */}
                                <p className="p-6 text-sm font-normal text-black">
                                {translate('label.b2b.basket.removeBasketConfirmText')}
                                </p>
                                <div className="flex items-center justify-around w-full px-6 mt-2">
                                    <button
                                        onClick={() => {
                                            setLoadingAction(LoadingActionType.REMOVE_BASKET)
                                            handleDeleteBasket()
                                        }}
                                        className="flex items-center justify-center w-full text-red-700 border border-gray-300 rounded-full shadow-sm btn btn-primary md:w-full"
                                    >
                                        {loadingAction === LoadingActionType.REMOVE_BASKET ? (
                                            <><LoadingDots /><span>{translate('common.label.removeText')}</span></>
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

export default DeleteBasketModal