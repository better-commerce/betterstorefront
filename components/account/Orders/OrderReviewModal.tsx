import { ArrowLeft } from "@components/icons";
import ReviewInput from "@components/product/Reviews/ReviewInput";
import { CLOSE_PANEL } from "@components/utils/textVariables";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

const OrderReviewModal = ({ isSubmitReview, setSubmitReview, isReviewdata }: any) => {
   return (
      <>
         <Transition.Root show={isSubmitReview} as={Fragment}>
            <Dialog
               as="div"
               open={isSubmitReview}
               className="fixed inset-0 z-50 overflow-hidden"
               onClose={() => setSubmitReview(false)}
            >
               <div className="absolute inset-0 overflow-hidden side-overlay bg-orange-900/20">
                  <Transition.Child
                     as={Fragment}
                     enter="transform transition ease-in-out duration-500 sm:duration-400"
                     enterFrom="translate-x-full"
                     enterTo="translate-x-0"
                     leave="transform transition ease-in-out duration-500 sm:duration-400"
                     leaveFrom="translate-x-0"
                     leaveTo="translate-x-full"
                  >
                     <Dialog.Overlay className="" />
                  </Transition.Child>

                  <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                     <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-400"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-400"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                     >
                        <div className="w-screen sm:max-w-md">
                           <div className="flex flex-col h-full overflow-x-hidden overflow-y-auto bg-white shadow-xl custom-scroll">
                              <div className="sticky top-0 z-50 flex flex-col w-full pt-5 bg-white border-b border-gray-200">
                                 <div className="flex items-start justify-start px-4 pb-3 sm:px-8">
                                    <Dialog.Title className="text-lg font-medium text-gray-900">
                                       <button
                                          type="button"
                                          className="p-0 mr-5 text-black hover:text-black"
                                          onClick={() => setSubmitReview(false)}
                                       >
                                          <span className="sr-only">{CLOSE_PANEL}</span>
                                          <XMarkIcon className="hidden w-6 h-6 sm:block" aria-hidden="true" />
                                          <ArrowLeft className="block w-6 h-6 sm:hidden" aria-hidden="true" />
                                       </button>
                                    </Dialog.Title>
                                    <div className="relative -top-1">
                                       <span className="text-xl font-bold dark:text-black">Rate & Review</span>
                                    </div>
                                 </div>
                              </div>
                              <ReviewInput
                                 data={isReviewdata}
                                 productId={isReviewdata?.productId ?? isReviewdata?.recordId}
                                 setSubmitReview={setSubmitReview}
                              />
                           </div>
                        </div>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition.Root>
      </>
   )
}
export default OrderReviewModal;