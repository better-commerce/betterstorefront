// Base Imports
import React, { FC, Fragment, useState } from "react";

// Package Imports
import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from '@headlessui/react'

// Other Imports
import { useUI } from "@components/ui/context";
import { CLOSE_PANEL, GENERAL_BULK_ORDER_PAD, GENERAL_COPY_AND_PASTE, GENERAL_SHOW_MORE_ENTRY_FIELDS } from "@components/utils/textVariables";
import { DEFAULT_ENTRY_FIELD_COUNT } from "@components/utils/constants";

const BulkAddSidebarView: FC = () => {
    const { closeSidebar } = useUI()
    const [entryFieldCount, setEntryFieldCount] = useState<number>(DEFAULT_ENTRY_FIELD_COUNT);

    const handleShowMoreEntryFields = () => {
        setEntryFieldCount(entryFieldCount + 5);
    };
    const handleClose = () => closeSidebar();

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

                                        {/* Dialog title */}
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
                                        <div className="flex flex-col">
                                            <button className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 " onClick={handleShowMoreEntryFields}>
                                                {GENERAL_SHOW_MORE_ENTRY_FIELDS}
                                            </button>

                                            <button className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ">
                                                {GENERAL_COPY_AND_PASTE}
                                            </button>
                                        </div>
                                        <div className="mt-8 flex flex-col">
                                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <table className="min-w-full divide-y divide-gray-300">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                        S.No
                                                                    </th>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        StockCode
                                                                    </th>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        Quantity
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white">

                                                                {
                                                                    Array.from(Array(entryFieldCount).keys()).map((x: number) => (
                                                                        <tr>
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                {x + 1}
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                                <input type="text" className="p-3 border bg-white text-gray-500 w-full"></input>
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                                <input type="text" className="p-3 border bg-white text-gray-500 w-full"></input>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </div>
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