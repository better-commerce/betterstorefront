// Base Imports
import React, { FC, Fragment } from "react";

// Package Imports
import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";

// Component Imports
import { BulkAddForm } from "./BulkAddForm";

// Other Imports
import { useUI } from "@components/ui/context";
import { CLOSE_PANEL, GENERAL_BULK_ORDER_PAD, GENERAL_COPY_AND_PASTE, GENERAL_LINE_BY_LINE } from "@components/utils/textVariables";

const BulkAddSidebarView: FC = () => {
    const { closeSidebar } = useUI();

    const onGridSubmit = (data: Array<{ stockCode: string, quantity: string }>) => {
    };

    const onCSVSubmit = (data: any) => {
    };

    const handleClose = () => closeSidebar();

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 overflow-hidden z-50 overflow-x-hidden"
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

                    <div className="fixed inset-y-0 right-0 pl-0 max-w-full flex overflow-x-hidden">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-screen max-w-md overflow-x-hidden">
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll overflow-x-hidden">
                                    <div className="flex-1 py-6 overflow-y-auto px-0 sm:px-0 overflow-x-hidden">

                                        {/* Dialog title */}
                                        <div className="flex items-start justify-between border-b pb-3">
                                            <Dialog.Title className="text-lg font-medium text-gray-900 pl-6">
                                                {GENERAL_BULK_ORDER_PAD}

                                            </Dialog.Title>
                                            <div className="flex">
                                                <button className="flex justify-center px-6 mr-3 text-sm items-center py-2 border border-transparent rounded-sm shadow-sm font-medium text-white bg-black hover:bg-gray-900 ">
                                                    {GENERAL_COPY_AND_PASTE}
                                                </button>
                                                <button className="flex justify-center px-6 mr-3 text-sm items-center py-2 border border-transparent rounded-sm shadow-sm font-medium text-white bg-black hover:bg-gray-900 ">
                                                    {GENERAL_LINE_BY_LINE}
                                                </button>
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

                                        {/*LINE BY LINE PANEL*/}
                                        <div className="flex flex-col px-6">
                                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <BulkAddForm onGridSubmit={onGridSubmit} onCSVSubmit={onCSVSubmit} />
                                                </div>
                                            </div>
                                        </div>

                                        {/*COPY AND PASTE PANEL*/}
                                        <div className="flex flex-col mt-4 px-6">
                                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <label className="font-bold text-sm leading-light">Copy and paste your file in following format: STOCKCODE[comma]Quantity</label>
                                                    <textarea rows={6} cols={12} className="p-4 rounded-md bg-white border text-sm w-full border-gray-300" placeholder="Copy and paste your file in following format: STOCKCODE[comma]Quantity"></textarea>
                                                </div>
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