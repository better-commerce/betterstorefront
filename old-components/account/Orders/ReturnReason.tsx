// Base Imports
import React, { Fragment, useState } from 'react'

// Package Imports
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/outline'

// Other Imports
// import { CancelOrderPageAction, PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES, PDP_REVIEW_IMAGE_SIZE_IN_BYTES, PDP_REVIEW_NO_OF_IMAGES_ALLOWED } from '@components/utils/constants';
// import { formatBytes } from '@framework/utils/app-util';
// import SubmitButton from '@old-components/common/SubmitButton';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import {
  PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES,
  PDP_REVIEW_IMAGE_SIZE_IN_BYTES,
  PDP_REVIEW_NO_OF_IMAGES_ALLOWED,
} from '@components/utils/constants'
import { Button, LoadingDots } from '@components/ui'
import classNames from 'classnames'
import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

const ReturnReason = ({
  returnsReasons,
  onItemReturn,
  item,
  itemReturnLoadingState,
  qty,
}: any) => {
  const translate = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [reason, setReason] = useState('')
  const [selectedImages, setSelectedImages] = useState<Array<any>>()

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  const uploadReturnItemPics = (ev: any) => {
    const target = ev?.target
    if (target) {
      const files = target?.files
      if (files?.length) {
        const allowedFileExtns = PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES?.split(
          ','
        )?.map((x) => x?.toLowerCase()?.trim())
        const allowedFiles = Array.from(files)?.filter(
          (file: any) =>
            allowedFileExtns?.includes(
              file?.name.substring(file?.name.lastIndexOf('.'))?.toLowerCase()
            ) && file.size <= PDP_REVIEW_IMAGE_SIZE_IN_BYTES
        )
        if (allowedFiles?.length) {
          let filesToUpload =
            allowedFiles?.length > 5
              ? allowedFiles?.slice(0, PDP_REVIEW_NO_OF_IMAGES_ALLOWED)
              : allowedFiles
          filesToUpload = (selectedImages ?? []).concat(allowedFiles)
          filesToUpload =
            filesToUpload?.length > 5
              ? filesToUpload?.slice(0, PDP_REVIEW_NO_OF_IMAGES_ALLOWED)
              : filesToUpload
          setSelectedImages(filesToUpload)
          setIsDisabled(false)
        }
      }
    }
  }

  return (
    <>
      {/* Reason Section UI Start*/}
      <div className="w-full">
        <div className="mx-auto cancel-continer">
          <Link href="/my-account/orders" className="mobile-view">
            <h4 className="mr-2 leading-none text-xl text-gray-900 uppercase font-bold">
              <i className="sprite-icon sprite-left-arrow mr-2"></i> {translate('label.help.returnItemText')}
            </h4>
          </Link>
          <div className="w-full py-4">
            <h4 className="text-base font-bold text-primary">
              {translate('label.returnReason.returnReasonHeadingText')} </h4>
            <p className="text-xs text-gray-700">
              {translate('common.label.serviceText')} </p>
            <div className="w-full py-4">
              {returnsReasons?.map((returnReason: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full method-order"
                  onClick={() => {
                    setReason(returnReason?.itemValue)
                  }}
                >
                  <div className="paymentBox paymentbox-sec">
                    <div className="methodName">
                      <label className="control control--radio">
                        <input
                          name="reason"
                          type="radio"
                          value={returnReason?.itemValue}
                          className="pay-inpt"
                        />
                        <div className="py-2 control__indicator border-bottom-only">
                          <div className="relative w-full py-2 pl-0 pr-2">
                            <span className="block text-sm font-light text-primary">
                              {returnReason?.itemText}
                            </span>
                            <span className="absolute flex items-center justify-center w-5 h-5 bg-gray-200 border border-gray-100 rounded-full top-2/4 -translate-y-2/4 right-4 check-icon">
                              <CheckIcon className="w-4 h-4 text-sm font-bold text-gray-200" />
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full">
              <h4 className="text-base font-bold text-primary">
                {translate('label.exchangeReason.picturesUploadLimitText')}s{' '}
              </h4>
              {/* <p>(Images exceeding {formatBytes(PDP_REVIEW_IMAGE_SIZE_IN_BYTES)} will be ignored)</p> */}
              <p className="text-sm mb-1 text-gray-700">
                {translate('label.exchangeReason.identifyProblemText')} </p>
              <p className="text-sm text-gray-700">
                <InformationCircleIcon className="inline-block w-4 h-4 mb-1" />{' '}
                Files must be <em>less than 5MB</em>
              </p>
              <p className="text-sm text-gray-700">
                <InformationCircleIcon className="inline-block w-4 h-4 mb-1" />{' '}
                Allowed file types: <em>.jpeg, .jpg, .png</em>
              </p>
              <div className="my-3">
                <input
                  type="file"
                  id="myfile"
                  name="myfile"
                  multiple
                  // accept={PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES}
                  onChange={(ev: any) => uploadReturnItemPics(ev)}
                />
                <label className="w-5 h-5" htmlFor="myfile">
                  <i className="sprite-icon sprite-file-plus"></i>
                </label>
              </div>
              {selectedImages?.length &&
                selectedImages?.map((file: any, idx: number) => (
                  <img
                    width={50}
                    height={50}
                    key={idx}
                    src={
                      generateUri(URL.createObjectURL(file), 'h=50&fm=webp') ||
                      IMG_PLACEHOLDER
                    }
                    alt="image"
                  />
                ))}
            </div>
            <div className="py-0">
              <p className="relative info-text py-4 text-gray-600">
                <InformationCircleIcon className="inline-block w-4 h-4 mb-1" />
                <span className="text-sm font-normal">
                  {' '}
                  {translate('label.orderDetails.itemRefundText1')} {item?.price?.currencySymbol}
                  {item?.price?.raw?.withTax * qty} {translate('label.orderDetails.itemRefundText2')} </span>
              </p>
              <p className="relative pt-0 pb-4 text-sm info-text">
                <b>Note:</b> {translate('label.returnReason.returnReasonNoteText')} </p>
              <Button
                type="button"
                className="!py-3 !font-bold !w-auto"
                disabled={!(!isDisabled && reason)}
                onClick={openModal}
              >
                {translate('label.returnReason.requestReturnBtnText')} </Button>
            </div>
          </div>
        </div>

        {/* modal return order */}
        <Transition show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            open={isOpen}
            className="relative z-10"
            onClose={closeModal}
          >
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-100 sm:duration-100"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-100 sm:duration-100"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="fixed inset-0 bg-gray-900/20" />
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
                      <div className="w-full sm:z-10 sm:left-1 sm:top-1">
                        <div className="flex justify-between px-4 py-3 border-b">
                          <div>
                            <h3 className="text-base font-semibold text-black dark:text-black">
                            {translate('label.help.returnItemText')} {' '}
                            </h3>
                          </div>
                          <button
                            type="button"
                            className="text-black rounded-md outline-none hover:text-gray-500"
                            onClick={closeModal}
                          >
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <XMarkIcon
                              className="relative top-0 w-7 h-7"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        <div className="w-full p-6 overflow-y-auto">
                          <div className="w-full">
                            <p className="text-sm text-black">
                              {translate('label.returnReason.returnConfirmText')}{translate('common.label.questionMark')}{' '}
                              {/*You'll miss out on savings of 648!*/}
                            </p>
                          </div>
                          <div className="w-full"></div>

                          <div className="w-full py-4">
                            <Button
                              type="button"
                              onClick={closeModal}
                              className="mb-3 !py-3 !font-bold !text-gray-900 !bg-transparent !border !border-gray-200"
                            >
                              {translate('label.returnReason.dontReturnBtnText')} </Button>
                            <Button
                              type="button"
                              onClick={async () => {
                                await onItemReturn(reason, selectedImages)
                              }}
                              className={classNames('!font-bold', {
                                '!py-3': !itemReturnLoadingState,
                                '!py-5': itemReturnLoadingState,
                              })}
                              disabled={itemReturnLoadingState}
                            >
                              {itemReturnLoadingState ? (
                                <LoadingDots />
                              ) : (
                                'Return Item'
                              )}
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
        {/* modal return order */}
      </div>
      {/* Reason Section UI End*/}
    </>
  )
}

export default ReturnReason
