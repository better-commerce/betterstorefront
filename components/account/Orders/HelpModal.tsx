// import { utcDateConvert } from "@framework/utils/parse-util";
import { CANCEL_ORDER, CHAT_WITH_US, GENERAL_CANCEL, GET_HELP_WITH_ORDER, HELP_ASSIST } from "@components/utils/textVariables";
import { Dialog, Transition } from "@headlessui/react";
import  {XMarkIcon}  from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

const HelpModal = ({ details, isHelpOpen, closeHelpModal, isHelpStatus, chooseHelpMode, onExchangeItem, onReturnItem, onCancelItem, isHelpOrderOpen, closeOrderHelpModal, onCancelOrder, returnRequestedItems, }: any) => {
   let replacement: any = "";
   let returnData: any = "";
   let replacementWindow: any = "";
   let returnWindow: any = "";
   if (isHelpStatus?.customInfo4 != null) {
      if (isHelpStatus != "" && isHelpOpen && isHelpStatus?.customInfo4?.includes("{")) {
         replacement = JSON.parse(isHelpStatus?.customInfo4);
         returnData = JSON.parse(isHelpStatus?.customInfo5);
         if (replacement?.formatted?.data["Replacement Eligibility"] != null) {
            replacementWindow = replacement?.formatted?.data["Replacement Eligibility"]?.replace(/[^0-9]/g, '');
         }
         if (returnData?.formatted?.data["Return Eligibility"] != null) {
            returnWindow = returnData?.formatted?.data["Return Eligibility"]?.replace(/[^0-9]/g, '');
         }
      }
   }

   let retunEligible = true;
   let replacementEligible = true;
   const returnDate = new Date(new Date(details?.order?.orderDate).getTime() + (returnWindow * 24 * 60 * 60 * 1000));
   const replacementDate = new Date(new Date(details?.order?.orderDate).getTime() + (replacementWindow * 24 * 60 * 60 * 1000));
   const currentDate = new Date();

   const shouldDisplayReturnItemCTA =
      isHelpStatus?.shippedQty > 0 &&
      returnRequestedItems[isHelpStatus?.orderLineRecordId] &&
      returnRequestedItems[isHelpStatus?.orderLineRecordId]?.isRMACreated === false &&
      returnRequestedItems[isHelpStatus?.orderLineRecordId]?.statusCode === 'Dispatch'

   if (currentDate > returnDate) { retunEligible = false; }
   if (currentDate > replacementDate) { replacementEligible = false; }
   return (
      <>
         <Transition.Root show={isHelpOpen} as={Fragment}>
            <Dialog as="div" open={isHelpOpen} className="relative z-999" onClose={closeHelpModal}>
               <div className="fixed inset-0 left-0 backdrop-blur-[1px] bg-black opacity-40" />
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="fixed inset-y-0 right-0 flex pointer-events-none bottom-to-top">
                        <Transition.Child
                           as={Fragment}
                           enter="transform transition ease-in-out duration-500 sm:duration-400"
                           enterFrom="translate-x-full"
                           enterTo="translate-x-0"
                           leave="transform transition ease-in-out duration-500 sm:duration-400"
                           leaveFrom="translate-x-0"
                           leaveTo="translate-x-full"
                        >
                           <Dialog.Panel className="w-screen pointer-events-auto sm:max-w-md">
                              <div className="relative z-50 flex flex-col h-full bg-white mobile-position shadow-xl mob-f-modal-width">
                                 <div className="w-full pt-4 sm:z-10 sm:px-0 sm:pb-2 sm:left-1 ">
                                    <div className='flex justify-between px-4 pb-4 mb-3 border-b sm:px-6'>
                                       <div>
                                          <h3 className="text-base font-bold text-black dark:text-black">Get Help with this item </h3>
                                          <p className='text-black font-10 font-normal'>{isHelpStatus?.name}</p>
                                       </div>
                                       <button
                                          type="button"
                                          className="text-black rounded-md outline-none hover:text-gray-500"
                                          onClick={closeHelpModal}
                                       >
                                          <span className="sr-only">Close panel</span>
                                          <XMarkIcon className="relative top-0 w-7 h-7" aria-hidden="true" />
                                       </button>
                                    </div>
                                    <div className="w-full px-4 pt-2 overflow-y-auto sm:px-6 innerscroll">
                                       <div className='w-full'>
                                          <p className='mb-4 text-black font-medium text-14'>We will be glad to assist you. What seems to be bothering you? </p>
                                          {details?.order?.allowedToReturn && !isHelpStatus?.allowedToExchange && !isHelpStatus?.allowedToReturn &&
                                             <p className='text-black text-medium text-14'>Return window is now closed since It's been over {returnWindow} Days you've recieved this item.</p>
                                          }
                                       </div>
                                       <div className='w-full py-4'>
                                          <a
                                             onClick={() => chooseHelpMode("Chat")}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             href={`https://api.whatsapp.com/send?phone=917829966655&text=Hi, I need help with my order id ${details?.order?.orderNo}`}
                                             className='block w-full hover:bg-accent-1 dark:hover:bg-accent-8 px-4 py-2 mb-2 text-center text-black border btn-basic-property font-bold uppercase'>
                                             {CHAT_WITH_US}
                                          </a>
                                          {shouldDisplayReturnItemCTA && (
                                             <a
                                                href="javascript:void(0);"
                                                onClick={() => onReturnItem("Return")}
                                                className='block w-full hover:opacity-90 dark:hover:bg-accent-8 px-4 py-2 mb-2 bg-gray-900 font-bold uppercase text-center text-white border btn-basic-property'>
                                                Return Item
                                             </a>
                                          )}
                                          {
                                             details?.order?.allowedToCancel && details?.order?.paymentStatus != 0 ?
                                                <a href="javascript:void(0);" className='block w-full hover:opacity-90 dark:hover:bg-accent-8 px-4 py-2 mb-2 bg-gray-900 font-bold uppercase text-center text-white border btn-basic-property'
                                                   onClick={() => onCancelItem("Cancel")}>
                                                   {GENERAL_CANCEL} Item
                                                </a>
                                                : null
                                          }
                                       </div>
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

         <Transition.Root show={isHelpOrderOpen} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={closeOrderHelpModal}>
               <div className="fixed inset-0 left-0 backdrop-blur-[1px] bg-black opacity-40" />
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="fixed inset-y-0 right-0 flex pointer-events-none bottom-to-top">
                        <Transition.Child
                           as={Fragment}
                           enter="transform transition ease-in-out duration-500 sm:duration-400"
                           enterFrom="translate-x-full"
                           enterTo="translate-x-0"
                           leave="transform transition ease-in-out duration-500 sm:duration-400"
                           leaveFrom="translate-x-0"
                           leaveTo="translate-x-full"
                        >
                           <Dialog.Panel className="w-full md:max-w-md pointer-events-auto">
                              <div className="relative z-50 flex flex-col h-full bg-white shadow-xl">
                                 <div className="w-full p-0 pt-4 sm:z-10 sm:px-0 sm:pb-2 sm:left-1 sm:top-1">
                                    <div className='flex justify-between px-4 pb-4 mb-3 border-b sm:px-6'>
                                       <div>
                                          <h3 className="text-base font-bold text-black dark:text-black">{GET_HELP_WITH_ORDER}</h3>
                                          <p className='text-black truncate font-10 font-medium max-w-mob'>{isHelpStatus?.name}</p>
                                       </div>
                                       <button
                                          type="button"
                                          className="text-black rounded-md outline-none hover:text-gray-500"
                                          onClick={closeOrderHelpModal}
                                       >
                                          <span className="sr-only">Close panel</span>
                                          <XMarkIcon className="relative top-0 w-7 h-7" aria-hidden="true" />
                                       </button>
                                    </div>
                                    <div className="w-full px-4 pt-2 overflow-y-auto sm:px-6 innerscroll">
                                       <div className='w-full'>
                                          <p className='mb-4 text-black font-medium text-14'>{HELP_ASSIST}</p>
                                          {/* {details.order.allowedToCancel &&
                                             <p className='text-black text-14'>Cancel window is now closed since you've recieved this item.</p>
                                          } */}
                                       </div>
                                       <div className='w-full py-4'>
                                          <a
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             href={`#`}
                                             className='block w-full hover:bg-accent-1 dark:hover:bg-accent-8 px-4 py-2 mb-2 text-center text-black border btn-basic-property font-bold uppercase'>
                                             {CHAT_WITH_US}
                                          </a>
                                          {
                                             details?.order?.allowedToCancel && details?.order?.paymentStatus != 0 ?
                                                <a href="javascript:void(0);" className='block w-full hover:opacity-90 dark:hover:bg-accent-8 px-4 py-2 mb-2 bg-gray-900 font-bold uppercase text-center text-white border btn-basic-property'
                                                   onClick={() => onCancelOrder("Cancel")}>
                                                   {CANCEL_ORDER}
                                                </a>
                                                : null
                                          }
                                       </div>
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

export default HelpModal;

