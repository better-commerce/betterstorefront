// Base Imports
import React, { Fragment, useState } from 'react'

// Package Imports
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Component Imports
import { LoadingDots } from '@components/ui'

// Other Imports
import { EmptyString, LoadingActionType } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

const AddBasketModal = ({ isOpen, closeModal, loadingAction, handleCreateBasket, setLoadingAction, }: any) => {
    const translate = useTranslation()
    const [basketName, setBasketName] = useState<string>(EmptyString)
    const handleKeyPress = (e: any) => {
        if (e.keyCode == 13) {
            handleCreateBasket(basketName)
        }
    }
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
                                    {translate('label.b2b.basket.createBasketLinkText')}
                                    {loadingAction === LoadingActionType.NONE && (
                                        <XMarkIcon
                                            className="w-5 h-5 text-gray-500 hover:text-gray-400"
                                            onClick={closeModal}
                                        ></XMarkIcon>
                                    )}
                                </Dialog.Title>
                                {/* <hr className="w-full my-2 shadow-md "></hr> */}
                                <p className="p-6 text-sm font-normal text-black">
                                    <input name="basketName" placeholder="Basket Name" onChange={(ev: any) => setBasketName(ev?.target?.value)} onKeyUp={(e: any) => handleKeyPress(e)} type="text" className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border border-slate-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11 " />
                                </p>
                                <div className="flex items-center justify-around w-full px-6 mt-2">
                                    <button
                                        onClick={() => handleCreateBasket(basketName)}
                                        className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 mr-2"
                                    >
                                        {loadingAction === LoadingActionType.GENERIC_OK_ACTION ? (
                                            <LoadingDots />
                                        ) : (
                                            <>{translate('common.label.okText')}</>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            closeModal()
                                        }}
                                        className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ml-2"
                                    >
                                        {translate('common.label.cancelText')}
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

export default AddBasketModal