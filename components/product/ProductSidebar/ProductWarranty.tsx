import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Fragment, useState } from "react";

export default function ProductWarranty({ isWarranty, setWarranty, replaceValue }: any) {


   return (
      <>
         <Transition.Root show={isWarranty} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={() => setWarranty(!isWarranty)}>
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
                                          onClick={() => setWarranty(!isWarranty)}
                                       >
                                          <span className="sr-only">Close panel</span>
                                          <XMarkIcon className="relative w-8 h-8 top-1" aria-hidden="true" />
                                       </button>
                                    </div>
                                 </div>
                                 <div className="p-6 overflow-y-auto bg-white">
                                    <div className="flex flex-col">
                                       {replaceValue["product.replacementeligibility"]?.length &&
                                          <div className='flex-1'>
                                             {replaceValue["product.replacementeligibility"]?.map((replaceAttr: any, rpdx: number) => (
                                                <Image alt={replaceAttr?.value} key={`product-${rpdx}-replacement-image`} src={`/assets/icons/${replaceAttr?.value?.toLowerCase()?.replace(/ /g, '')}.svg`} width={115} height={90} layout="fixed" />
                                             ))}
                                          </div>
                                       }
                                       <div className="flex-1">
                                          {replaceValue["product.replacementeligibility"]?.length &&
                                             <div className='flex-1'>
                                                {replaceValue["product.replacementeligibility"]?.map((replaceText: any, rpdx: number) => (
                                                   <h3 className="text-2xl font-bold text-primary" key={`product-${rpdx}-replacement`}>
                                                      {replaceText.value == "500 Day" ? "500 Days Replacement" : "First Try Replacement"}
                                                   </h3>
                                                ))}
                                             </div>
                                          }
                                          <h3 className="text-2xl font-bold text-primary">
                                             Guarantee
                                          </h3>
                                       </div>
                                       {replaceValue["product.replacementeligibility"]?.length &&
                                          <div className='flex-1'>
                                             {replaceValue["product.replacementeligibility"]?.map((replaceText: any, repdx: number) => (
                                                <div className="w-full" key={`product-${repdx}-replacement-text`}>
                                                   {replaceText.value == "30 Day 1st Try Guarantee" ? (
                                                      <div className="w-full">
                                                         <div className="flex-1 mt-6">
                                                            <p className="text-sm font-normal text-black">
                                                               Damensch believes in a world driven by comfort. Which means if you're a first time customer of our innerwear products and find the size, colour or fit not to your liking and comfort then we’ll send a replacement for the same product in your preferred size. If you’re not satisfied with the product, we’ll give you a full refund for the first product. Read details below:
                                                            </p>
                                                         </div>
                                                         <div className="flex-1 mt-4">
                                                            <p className="my-2 text-sm font-normal text-black">
                                                               <b> Eligible for Refund/Replacement: </b>
                                                            </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(1) First innerwear purchase from DaMENSCH </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(2) One single innerwear product </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(3) Colour fading, wrong colour, wrong size, manufacturing defect, delivery defect</p>
                                                            <p className="my-2 mt-4 text-sm font-normal text-black">
                                                               <b> Not Eligible for Refund/Replacement:  </b>
                                                            </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(1) More than one product and/or consecutive purchase form DaMENSCH</p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(2) Innerwear packs of 2 or more (If you’ve bought a pack of 2 or more, only one product from the pack will be eligible for refund, while the others qualify for exchange only if it is unused and kept in the original delivery condition) </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(3) Defects noticed after 30 days from purchase</p>
                                                            <p className="my-2 mt-4 text-sm font-normal text-black">
                                                               <b> How to avail refund:  </b>
                                                            </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">The 30 Day First Try Guarantee covers refund or replacement only on the innerwear product purchase. Any innerwear product that has been tried on or washed need not be returned. Simply raise a request with your product defect or issue with a clear photograph of the same and we’ll send a replacement your way. </p>
                                                         </div>
                                                      </div>
                                                   ) : (
                                                      <>
                                                         <div className="flex-1 mt-6">
                                                            <p className="text-sm font-normal text-black">
                                                               Please note that this warranty is valid only for one replacement, in the case of wear and tear in the t-shirt after regular usage.
                                                            </p>
                                                         </div>
                                                         <div className="flex-1 mt-4">
                                                            <p className="my-2 text-sm font-normal text-black">
                                                               <b> When the warranty is not applicable:</b>
                                                            </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(1) Tears, rips or snags caused by external objects</p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(2) Damage caused by chlorine, heat, gas, bleach or any liquid above 50°C </p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">(3) The product is purchased from an unauthorised dealer</p>
                                                            <p className="my-1 text-xs font-normal text-gray-400">
                                                               Head over to the FAQ section to find out more
                                                            </p>
                                                         </div>
                                                      </>
                                                   )}
                                                </div>
                                             ))}
                                          </div>
                                       }
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
   )
}