import { useTranslation } from "@commerce/utils/use-translation";
import axios from "axios";
import { useState } from "react";
import { Dialog } from '@components/account/RequestForQuote/RFQCancleDialog';
import { DATE_FORMAT, NEXT_UPDATE_STATUS_RFQ } from "@components/utils/constants";
import { AlertType } from "@framework/utils/enums";
import { useUI } from "@components/ui";
import moment from "moment";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function RFQDetailsComponent({ rfqId, rfqData, fetchRFQData }: any) {
    const translate = useTranslation();
    const { setAlert } = useUI();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cancelComment, setCancelComment] = useState('');

    const handleCancelRFQ = async () => {
        if (!cancelComment.trim()) {
            alert(translate('label.myAccount.rfq.provideCommentForCancellation'));
            return;
        }
        try {
            const response = await axios.post(NEXT_UPDATE_STATUS_RFQ, {
                id: rfqId,
                status: 'Cancelled',
                Comment: cancelComment,
                Reason: '',
            });
            if (response?.data?.message) {
                setAlert({ type: AlertType.SUCCESS, msg: response?.data?.message });
            }
            await fetchRFQData();
            setIsDialogOpen(false);
            setCancelComment('');
        } catch (err) {
            setAlert({ type: AlertType.ERROR, msg: translate('label.myAccount.rfq.requestCouldNotProcessErrorMsg') });
        }
    };

    return (
        <div>
            <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                <li className='flex items-center text-10-mob sm:text-sm'>
                    <Link href="/my-account/request-for-quote" passHref>
                        <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" > Request For Quote </span>
                    </Link>
                </li>
                <li className='flex items-center text-10-mob sm:text-sm'>
                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                        <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                    </span>
                </li>
                <li className="flex items-center text-10-mob sm:text-sm" >
                    <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
                        {rfqData?.rfqNumber ? rfqData?.rfqNumber : 'RFQ Detail'}
                    </span>
                </li>
            </ol>
            <div className='mb-4'>
                <h1 className="flex items-center gap-1 text-xl font-normal sm:text-2xl justify-normal dark:text-black">
                    {rfqData?.rfqNumber ? rfqData?.rfqNumber : 'RFQ Detail'} {rfqData?.quoteNumber != null && <Link className='text-sm font-semibold text-sky-500' href={`/my-account/my-company/quotes/${rfqData?.quoteBasketId}`}>({`Quote #: ${rfqData?.quoteNumber}`})</Link>}
                </h1>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="w-full pb-2">
                <div className="w-full">
                    <div className="flex justify-between">
                        <div className="relative">
                            <div className="w-full">
                                <h5 className="font-bold text-18 text-secondary-full-opacity ">Company</h5>
                                <p className="text-sm text-black-light dark:text-gray-900">{rfqData?.companyName}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h5 className="uppercase font-10 text-black-light dark:text-gray-900">RFQ Created</h5>
                            <p className="text-sm dark:text-black text-primary">{moment(new Date(rfqData?.created)).format(DATE_FORMAT)}</p>
                        </div>
                        <div className="hidden sm:block">
                            <h5 className="uppercase font-10 text-black-light dark:text-gray-900">Valid Until</h5>
                            <p className={`text-sm dark:text-black ${rfqData?.validDays > 0 ? 'text-primary' : 'text-red-400'}`}>{rfqData?.validDays > 0 ? moment(new Date(rfqData?.validUntil)).format(DATE_FORMAT) : 'expired'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex flex-col w-full gap-2 my-4">
                <div className="flex justify-between">
                    <h4 className="font-bold text-18 text-secondary-full-opacity ">Details</h4>
                    <span className={`px-4 py-3 text-sm font-semibold leading-none truncate rounded-full ${rfqData?.status == "QuoteCreated" ? 'label-confirmed' : (rfqData?.status == "Submitted" || rfqData?.status == "Received") ? 'label-blue' : rfqData?.status == "Cancelled" ? 'label-Cancelled' : 'label-pending'}`}>
                        {rfqData?.status == "QuoteCreated" ? 'Quote Created' : (rfqData?.status == "Submitted" || rfqData?.status == "Received") ? 'Submitted' : rfqData?.status == "Cancelled" ? 'Cancelled' : ''}
                    </span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.name')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.firstName} {rfqData?.lastName}</span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.email')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.email}</span>
                </div>
                {rfqData?.notes &&
                    <div className="flex justify-start w-full gap-1">
                        <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.notes')}:</span>
                        <span className="text-sm font-normal text-black">{rfqData?.notes}</span>
                    </div>
                }
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex flex-col w-full my-4">
                <h4 className="font-bold text-18 text-secondary-full-opacity ">{translate('label.myAccount.rfq.lineItems')}</h4>
                <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4 ">{translate('label.myAccount.rfq.stockCode')}</th>
                                <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">{translate('label.myAccount.rfq.productName')}</th>
                                <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">{translate('label.myAccount.rfq.quantity')}</th>
                                <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">{translate('label.myAccount.rfq.price')}</th>
                                <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">{translate('label.myAccount.rfq.targetPrice')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rfqData?.lines?.map?.((item: any, index: any) => (
                                <tr key={index} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                                    <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{item?.stockCode}</td>
                                    <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{item?.productName}</td>
                                    <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{item?.qty}</td>
                                    <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{item?.price ? `${item?.price?.formatted?.withTax}` : translate('label.myAccount.rfq.notAvailable')}</td>
                                    <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{item?.targetPrice ? `${item?.targetPrice.formatted?.withTax}` : translate('label.myAccount.rfq.notAvailable')}</td>
                                </tr>
                            ))}
                            <tr className="text-xs bg-gray-200 border-t shadow-none group border-slate-400 hover:shadow hover:bg-gray-100">
                                <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap"></td>
                                <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap"></td>
                                <td className="px-3 py-3 text-[13px] text-black font-semibold whitespace-nowrap">{rfqData?.lines?.reduce((total: number, item: any) => total + (item?.qty || 0), 0)}</td>
                                <td className="px-3 py-3 text-[13px] text-black font-semibold whitespace-nowrap">{rfqData?.grandTotal?.formatted?.withTax}</td>
                                <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex justify-between w-full my-4">
                <Link href="/my-account/request-for-quote" className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-transparent dark:bg-slate-900 hover:transparent !text-black border border-gray-800 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">{translate('label.myAccount.rfq.backToList')}</Link>
                {(rfqData?.status !== 'Cancelled' && rfqData?.status !== 'QuoteCreated') && (
                    <button className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6 ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0" onClick={() => setIsDialogOpen(true)} > {translate('label.myAccount.rfq.cancelRFQ')} </button>
                )}
            </div>
            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={translate('label.myAccount.rfq.cancelRFQ')}>
                <div className="mb-4">
                    {<label htmlFor="cancelComment" className="block mb-2 text-sm font-medium text-gray-700">{translate('label.myAccount.rfq.commentRequired')}</label>}
                    <input className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} value={cancelComment} onChange={(e) => setCancelComment(e.target.value)} placeholder={translate('label.myAccount.rfq.enterReason')} />
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn" onClick={() => setIsDialogOpen(false)}>{translate('label.myAccount.rfq.cancel')}</div>
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn btn-primary" onClick={handleCancelRFQ}>{translate('label.myAccount.rfq.confirmCancellation')}</div>
                </div>
            </Dialog>
        </div>
    )
}