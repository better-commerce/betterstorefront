import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Fragment, useState } from "react";

export default function ProductReturn({ isReturn, setReturn, data }: any) {


   return (
      <>
         <Transition.Root show={isReturn} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={() => setReturn(!isReturn)}>
               <div className="fixed inset-0 left-0 bg-orange-900/20" />
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none bottom-to-top">
                        <Transition.Child
                           as={Fragment}
                           enter="transform transition ease-in-out duration-500 sm:duration-400"
                           enterFrom="translate-x-full"
                           enterTo="translate-x-0"
                           leave="transform transition ease-in-out duration-500 sm:duration-400"
                           leaveFrom="translate-x-0"
                           leaveTo="translate-x-full"
                        >
                           <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                              <div className="relative z-50 flex flex-col h-full bg-white shadow-xl mobile-position sm:bg-white">
                                 <div className="absolute z-10 px-4 py-6 sm:px-6 sm:left-1 right-1 sm:relative top-1 ">
                                    <div className="flex justify-start">
                                       <button
                                          type="button"
                                          className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                                          onClick={() => setReturn(!isReturn)}
                                       >
                                          <span className="sr-only">Close panel</span>
                                          <XMarkIcon className="relative w-8 h-8 top-1" aria-hidden="true" />
                                       </button>
                                    </div>
                                 </div>
                                 {data?.map((retur: any, rid: number) => (
                                    <>
                                       <div className="p-6 overflow-y-auto bg-white" key={rid}>
                                          <div className="flex flex-col">
                                             <div className="flex-1">
                                                <Image alt="Return" src={`/assets/images/exchange.png`} width={115} height={90} layout="fixed" />
                                             </div>
                                             <div className="flex-1 mt-4">
                                                <h3 className="text-2xl font-bold text-black">
                                                   {retur.value} Days
                                                </h3>
                                                <h3 className="text-2xl font-bold text-black">
                                                   Return &amp; Exchange
                                                </h3>
                                             </div>
                                             <div className="flex-1 mt-6">
                                                <p className="text-sm font-normal text-black">
                                                   BetterStore is all about doing more everyday with comfort. If you're not happy with the size of any product purchased, or change your mind regarding the colour you picked, we'll be happy to exchange it for you with the preferred size or colour of the product of your choice. If you don't like our product, we'll refund the same, read below for details:
                                                </p>
                                             </div>
                                             <div className="flex-1 mt-4">
                                                <p className="my-4 text-xs font-normal text-gray-400">
                                                   Eligible for refund/replacement: Wrong size or change of colour product intact and not tried on product tag and packaging intact
                                                </p>
                                                <p className="my-4 text-xs font-normal text-gray-400">
                                                   Not eligible for refund-replacement: Product has been washed or tried on no product tag or original packaging Tear caused by external forces Beyond 15 days date of delivery
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    </>
                                 ))}

                              </div>
                           </Dialog.Panel>
                        </Transition.Child>
                     </div>
                  </div>
               </div>
            </Dialog>
         </Transition.Root>
      </>
   )
}