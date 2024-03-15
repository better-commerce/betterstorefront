// Base Imports
import React, { Fragment, useState } from 'react';
import cn from 'classnames';

// Package Imports
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'
import { Button, LoadingDots } from '@components/ui';
import Spinner from '@components/ui/Spinner';
import { translate } from '@components/services/localization';


export default function CancelReason({ cancellationReasons, onItemCancellation, item, cancelTitle, cancelLoadingState, hideCancellationReasons, }: any) {
  let [reason, setReason] = useState("")
  let [isOpen, setIsOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true);
  
  const openModal = () => {
    setIsOpen(true)
  };
  const closeModal = () => {
    setIsOpen(false)
  };

  return (
    <>
      {/* Reason Section UI Start*/}
      <div className='w-full'>
        <div className='mx-auto cancel-continer'>
           <a className="block mr-2 leading-none mobile-view" href="#" onClick={(e) => {
              e.preventDefault()
              hideCancellationReasons()
            }}>
              <h4 className="max-w-4xl mx-auto text-xl font-semibold text-gray-900 dark:text-black">
                <i className="sprite-icon sprite-left-arrow mr-2"></i> {translate('label.cancelReason.cancelReasonHeadingText')}
              </h4>
          </a>
          <div className='w-full py-4'>
            <h4 className='text-base font-bold text-primary dark:text-black'>{translate('label.cancelReason.cancelTitle')} {cancelTitle} {translate('common.label.questionMark')}</h4>
            <p className='text-sm text-gray-600 dark:text-black'>{translate('common.label.serviceText')}</p>

            {
              !cancellationReasons ? (
                <Spinner/>
              ) : (
                <>
                  <div className='w-full py-4'>

                    {cancellationReasons?.map((cancelReason: any, idx: number) => (
                      <div key={idx}
                        className="w-full method-order"
                        onClick={() => {
                          setIsDisabled(false);
                          setReason(cancelReason?.itemValue);
                        }}
                      >
                        <div className="paymentBox paymentbox-sec">
                          <div className="methodName">
                            <label className="control control--radio">
                              <input name="reason" type="radio" value={cancelReason?.itemValue} className='pay-inpt' />
                              <div className="py-2 control__indicator border-bottom-only">
                                <div className="relative w-full py-2 pl-0 pr-2">
                                  <span className="block text-sm font-normal text-primary dark:text-black">{cancelReason?.itemText}</span>
                                  <span className="absolute flex items-center justify-center w-5 h-5 bg-gray-200 border border-gray-100 rounded-full top-2/4 -translate-y-2/4 right-4 check-icon">
                                    <CheckIcon
                                      className="w-4 h-4 text-sm font-bold text-gray-200"
                                    />
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='py-0'>
                    <p
                      className='relative info-text py-4 text-gray-600'>
                      <InformationCircleIcon className='inline-block w-4 h-4 mb-1' />
                      <span className='text-sm font-normal dark:text-black'>
                        {translate('label.orderDetails.orderRefundInfo')}
                      </span>
                    </p>

                    <Button
                      type="button"
                      className={`!inline-block !w-auto !py-3 text-sm font-bold text-center text-white bg-red-700 border dark:text-black cursor-pointer ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isDisabled}
                      onClick={openModal} 
                    >
                      {translate('common.label.cancelText')} {cancelTitle}
                    </Button>
                  </div>
                </>
              )
            }
          </div>
        </div>
      </div>
      {/* Reason Section UI End*/}

      {/* modal cancel order */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" open={isOpen} className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-100 sm:duration-100"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-100 sm:duration-100"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="fixed inset-0 bg-gray-700/20" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-0 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                  <div className="relative z-50 flex flex-col h-full">
                    <div className="w-full sm:left-1 sm:top-1">
                      <div className='flex justify-between px-4 py-3 border-b'>
                        <div>
                          <h3 className="text-base font-bold text-black dark:text-black">{translate('common.label.cancelText')} {cancelTitle} </h3>
                        </div>
                        <button
                          type="button"
                          className="text-black rounded-md outline-none hover:text-gray-500"
                          onClick={closeModal}
                        >
                          <span className="sr-only">{translate('common.label.closePanelText')}</span>
                          <XMarkIcon className="relative top-0 w-7 h-7" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="w-full p-6 overflow-y-auto">
                        <div className='w-full'>
                          <p className='text-sm text-black'>{translate('label.cancelReason.cancelConfirmationText')} {cancelTitle} {translate('common.label.questionMark')}</p>
                        </div>
                        <div className='w-full py-4'>
                          <Button
                            variant='slim'
                            onClick={closeModal}
                            className='mb-3 !py-3 !font-bold !text-gray-900 !bg-transparent !border !border-gray-200'
                          >
                           {translate('common.label.donotCancelText')}
                          </Button>
                          <Button
                            variant='slim'
                            onClick={async () => await onItemCancellation(reason)}
                            className={cn('!font-bold', {
                              '!py-3': !cancelLoadingState,
                              '!py-4': cancelLoadingState,
                            })}
                            disabled={cancelLoadingState}
                          >
                            {cancelLoadingState ? <LoadingDots /> : `${translate('common.label.cancelText')} ${cancelTitle}`}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* modal cancel order */}
    </>
  )
}
