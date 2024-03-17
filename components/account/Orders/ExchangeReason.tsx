// Base Imports
import React, { Fragment, useState } from 'react';

// Package Imports
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline'

// Component Imports
import ExchangeSelection from '../../../components/account/Orders/ExchangeSelection';

// Other Imports
// import { formatBytes } from '@framework/utils/app-util';
// import { PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES, PDP_REVIEW_IMAGE_SIZE_IN_BYTES, PDP_REVIEW_NO_OF_IMAGES_ALLOWED, PRODUCTS_SLUG_PREFIX } from '@components/utils/constants';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import { generateUri } from '@commerce/utils/uri-util';
import { useTranslation } from '@commerce/utils/use-translation'


const ExchangeReason = ({ ExchangesReasons, onItemExchange, item, onGetProduct, submitState, submitDispatch, deviceInfo }: any) => {
    const translate = useTranslation()
    const [reason, setReason] = useState("")
    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedImages, setSelectedImages] = useState<Array<any>>();
    const [showExchangeSelection, setShowExchangeSelection] = useState(false);

    const hideExchangeReasons = () => {
        window.scrollTo(0, 0);
        setShowExchangeSelection(!showExchangeSelection);
    };

    const getProduct = async (slug: string) => {
        // return await onGetProduct(slug.replace(PRODUCTS_SLUG_PREFIX, ""));
    };

    const uploadExchangeItemPics = (ev: any) => {
        const target = ev?.target;
        if (target) {
            const files = target?.files;
            // if (files?.length) {
            //     const allowedFileExtns = PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES?.split(",")?.map(x => x?.toLowerCase()?.trim());
            //     const allowedFiles = Array.from(files)?.filter((file: any) => allowedFileExtns?.includes(file?.name.substring(file?.name.lastIndexOf("."))?.toLowerCase()) && file.size <= PDP_REVIEW_IMAGE_SIZE_IN_BYTES);
            //     if (allowedFiles?.length) {
            //         let filesToUpload = allowedFiles?.length > 5 ? allowedFiles?.slice(0, PDP_REVIEW_NO_OF_IMAGES_ALLOWED) : allowedFiles;
            //         filesToUpload = (selectedImages ?? []).concat(allowedFiles);
            //         filesToUpload = filesToUpload?.length > 5 ? filesToUpload?.slice(0, PDP_REVIEW_NO_OF_IMAGES_ALLOWED) : filesToUpload;
            //         setSelectedImages(filesToUpload);
            //         setIsDisabled(false);
            //     }
            // }
        }
    };

    return (
        <>
            {/* Reason Section UI Start*/}
            <div className='w-full' style={{ display: showExchangeSelection ? "none" : "block" }}>
                <div className='mx-auto cancel-continer'>
                    <h4 className='mb-2 text-xl font-bold text-black'>{translate('label.exchangeReason.exchangeReasonHeadingText')}</h4>
                    <div className='w-full py-4'>
                        <h4 className='text-base font-bold text-primary'>{translate('label.exchangeReason.exchangeReasonTitle')}</h4>
                        <p className='text-xs text-brown-light'>{translate('common.label.serviceText')}</p>
                        <div className='w-full py-4'>
                            {ExchangesReasons?.map((exchangeReason: any, idx: number) => (
                                <div key={idx}
                                    className="w-full method-order"
                                    onClick={() => {
                                        setReason(exchangeReason?.itemValue);
                                    }}
                                >
                                    <div className="paymentBox paymentbox-sec">
                                        <div className="methodName">
                                            <label className="control control--radio">
                                                <input name="reason" type="radio" value={exchangeReason?.itemValue} className='pay-inpt' />
                                                <div className="py-2 control__indicator border-bottom-only">
                                                    <div className="relative w-full py-2 pl-0 pr-2">
                                                        <span className="block text-sm font-light text-primary">{exchangeReason?.itemText}</span>
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
                        <div className='w-full'>
                            <h4 className='text-base font-bold text-primary'>{translate('label.exchangeReason.picturesUploadLimitText')} </h4>
                            {/* <p>(Images exceeding {formatBytes(PDP_REVIEW_IMAGE_SIZE_IN_BYTES)} will be ignored)</p> */}
                            <p className='text-sm mb-1 text-brown-light'>{translate('label.exchangeReason.identifyProblemText')}</p>
                            <p className='text-xs text-brown-light'>{translate('label.exchangeReason.uploadFileSizeLimitText')}</p>
                            <p className='text-xs text-brown-light'>{translate('label.exchangeReason.allowedFileExtensionsText')}</p>
                            <div className='my-3'>
                                <input
                                    type="file"
                                    id="myfile"
                                    name="myfile"
                                    multiple
                                    // accept={PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES}
                                    onChange={(ev: any) => uploadExchangeItemPics(ev)}
                                />
                                <label className="w-5 h-5" htmlFor="myfile">
                                    <i className='sprite-icon sprite-file-plus'></i>
                                </label>
                            </div>

                            {
                                selectedImages?.length && (
                                    selectedImages?.map((file: any, idx: number) => (
                                        <img
                                            width={50}
                                            height={50}
                                            key={idx}
                                            src={generateUri(URL.createObjectURL(file),'h=50&fm=webp')||IMG_PLACEHOLDER}
                                            alt="product-image"
                                        />
                                    ))
                                )
                            }
                        </div>
                        <div className='py-4'>
                            <button
                                type="button"
                                className={`py-4 px-8 border text-white bg-black block text-center font-bold link-btn cursor-pointer ${!(!isDisabled && reason) ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!(!isDisabled && reason)}
                                onClick={async () => {
                                    // await onItemExchange(reason)
                                    hideExchangeReasons();
                                }}
                            >{translate('label.exchangeReason.chooseNewItemText')}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reason Section UI End*/}

            {/* Exchange selection UI start */}
            <div className='w-full' style={{ display: showExchangeSelection ? "block" : "none" }}>
                <ExchangeSelection
                    item={item}
                    reason={reason}
                    selectedImages={selectedImages}
                    onGetProduct={getProduct}
                    onItemExchange={onItemExchange}
                    submitState={submitState}
                    deviceInfo={deviceInfo}
                />
            </div>
            {/* Exchange selection UI */}
        </>
    )
}

export default ExchangeReason;