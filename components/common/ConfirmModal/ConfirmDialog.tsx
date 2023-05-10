// Base Imports
import React, { Fragment } from "react";

// Package Imports
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from "@heroicons/react/24/outline";

// Component Imports
import { useUI } from "@components/ui/context";

// Other Imports
import { CLOSE_PANEL } from "@components/utils/textVariables";


const ConfirmDialog = () => {

    const { confirmDialogData, resetConfirmDialogData } = useUI();
    const { title = "", show = false, message = "", okText = "OK", cancelText = "Cancel", okCallback = () => { }, cancelCallback = () => { } } = confirmDialogData || {};

    return (
        <>
            {/* REMOVE CONFIRMATION PANEL */}
            <Transition.Root show={show} as={Fragment}>
                <Dialog as="div" className="relative z-99" onClose={() => resetConfirmDialogData()}>
                    <div className="fixed inset-0 left-0 bg-orange-600/0" />
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 pointer-events-none sm:pl-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-200 sm:duration-200"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-y-0"
                                    leave="transform transition ease-in-out duration-200 sm:duration-200"
                                    leaveFrom="translate-y-0"
                                    leaveTo="translate-y-full"
                                >
                                    <Dialog.Panel className="w-screen pointer-events-auto">
                                        <div className="relative flex flex-col h-full shadow-xl bg-orange-900/20 z-99">
                                            <div className="w-full h-auto max-w-md mx-auto bg-white center-fix-panel">
                                                <div className="flex justify-between w-full px-8 py-3 bg-white border-b border-gray-100 shadow">
                                                    <h4 className="inline font-semibold text-black text-md">{title}</h4>
                                                    <button
                                                        type="button"
                                                        className="inline p-0 text-black hover:text-black"
                                                        onClick={() => resetConfirmDialogData()}
                                                    >
                                                        <span className="sr-only">{CLOSE_PANEL}</span>
                                                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                                                    </button>

                                                </div>
                                                <div className="flex flex-col w-full px-8 my-6">
                                                    <p className="text-sm font-normal text-black">{message}</p>
                                                </div>
                                                <div className="flex justify-between gap-6 px-8 mb-6">
                                                    <button
                                                        type="button" className="w-full px-0 py-3 text-sm font-semibold text-red-500 bg-white border border-gray-300 sm:px-6 hover:border-red-200 hover:bg-gray-800"
                                                        onClick={() => {
                                                            if (okCallback) {
                                                                okCallback();
                                                            }
                                                        }}>
                                                        {okText}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 text-white bg-black border-2 border-black rounded-sm hover:bg-gray-800 hover:text-whitesm:px-6 hover:border-gray-900"
                                                        onClick={() => {
                                                            if (cancelCallback) {
                                                                cancelCallback();
                                                            }
                                                        }}
                                                    >
                                                        {cancelText}
                                                    </button>
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
    );

}

export default ConfirmDialog;