// Base Imports
import React, { FC, Fragment } from "react";

// Package Imports
import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from '@headlessui/react'

// Other Imports
import { useUI } from "@components/ui/context";
import { CLOSE_PANEL, GENERAL_BULK_ORDER_PAD } from "@components/utils/textVariables";

const BulkAddSidebarView: FC = () => {
    const { closeSidebar } = useUI()
    const handleClose = () => closeSidebar()

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 overflow-hidden z-50"
                onClose={handleClose}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="" />
                    </Transition.Child>

                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-screen max-w-md">
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                                {GENERAL_BULK_ORDER_PAD}
                                            </Dialog.Title>
                                            <div className="ml-3 h-7 flex items-center">
                                                <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={handleClose}
                                                >
                                                    <span className="sr-only">{CLOSE_PANEL}</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
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
    );

};

export default BulkAddSidebarView;