
import { useTranslation } from "@commerce/utils/use-translation";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog } from '@components/account/RequestForQuote/RFQCancleDialog';
import { DATE_FORMAT, NEXT_UPDATE_STATUS_RFQ } from "@components/utils/constants";
import { AlertType } from "@framework/utils/enums";
import { useUI } from "@components/ui";
import moment from "moment";
import { priceFormat } from "@framework/utils/parse-util";


export default function RFQDetailsComponent({ rfqId, rfqData, fetchRFQData }: any) {
    const translate = useTranslation();
    const router = useRouter();
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
            <div className="w-full pb-2">
                <div className="w-full">
                    <div className="flex justify-between">
                        <div className="relative pl-9">
                            <a
                                href="#"
                                className="absolute left-0 top-2/4 -translate-y-2/4 dark:text-gray-900"
                                onClick={() => {
                                    router.push('/my-account/request-for-quote');
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-arrow-left"
                                    viewBox="0 0 16 16"
                                >
                                    {' '}
                                    <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />{' '}
                                </svg>
                            </a>
                            {
                                //let orderLabel.order=  Details";
                            }

                            <div className="w-full">
                                <h5 className="font-bold text-18 text-secondary-full-opacity ">
                                    RFQ Details
                                </h5>

                                <p className="text-sm text-black-light dark:text-gray-900">
                                    {rfqData?.rfqNumber && "#" + rfqData?.rfqNumber}
                                </p>

                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h5 className="uppercase font-10 text-black-light dark:text-gray-900">
                                FFQ Created </h5>
                            <p className="text-sm dark:text-black text-primary">
                                {moment(new Date(rfqData?.created)).format(DATE_FORMAT)}
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <h5 className="uppercase font-10 text-black-light dark:text-gray-900">
                                Valid Until </h5>
                            <p className="text-sm dark:text-black text-primary">
                                {moment(new Date(rfqData?.validUntil)).format(DATE_FORMAT)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex flex-col w-full gap-2 my-4">
                <div className="flex justify-between">
                    <h4 className="font-bold text-18 text-secondary-full-opacity ">Details</h4>
                    <span className={`px-4 py-3 text-sm font-semibold leading-none truncate rounded-full ${rfqData?.status == "QuoteCreated" ? 'label-confirmed' : rfqData?.status == "Submitted" ? 'label-blue' : rfqData?.status == "Cancelled" ? 'label-Cancelled' : 'label-pending'}`}>{rfqData?.status}</span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.name')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.firstName} {rfqData?.lastName}</span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.email')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.firstName} {rfqData?.email}</span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.company')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.firstName} {rfqData?.companyName}</span>
                </div>
                <div className="flex justify-start w-full gap-1">
                    <span className="text-sm font-semibold text-black">{translate('label.myAccount.rfq.notes')}:</span>
                    <span className="text-sm font-normal text-black">{rfqData?.firstName} {rfqData?.notes}</span>
                </div>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex flex-col w-full my-4">
                <h4 className="font-bold text-18 text-secondary-full-opacity ">{translate('label.myAccount.rfq.lineItems')}</h4>
                <div className="overflow-hidden border my-7 rounded-2xl border-slate-200">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200 ">{translate('label.myAccount.rfq.stockCode')}</th>
                                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">{translate('label.myAccount.rfq.productName')}</th>
                                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">{translate('label.myAccount.rfq.quantity')}</th>
                                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">{translate('label.myAccount.rfq.price')}</th>
                                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">{translate('label.myAccount.rfq.targetPrice')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rfqData?.lines?.map?.((item: any, index: any) => (
                                <tr key={index} className="text-xs bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                                    <td className="p-2 text-sm text-left">{item?.stockCode}</td>
                                    <td className="p-2 text-sm text-left">{item?.productName}</td>
                                    <td className="p-2 text-sm text-left">{item?.qty}</td>
                                    <td className="p-2 text-sm text-left">{item?.price ? `${item?.price.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
                                    <td className="p-2 text-sm text-left">{item?.targetPrice ? `${item?.targetPrice.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
            <div className="flex justify-between w-full my-4">
                <button className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-transparent dark:bg-slate-900 hover:transparent !text-black border border-gray-800 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0" onClick={() => router?.back()}>{translate('label.myAccount.rfq.backToList')}</button>
                {(rfqData.status !== 'Cancelled') &&
                    <button className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0" onClick={() => setIsDialogOpen(true)}>{translate('label.myAccount.rfq.cancelRFQ')}</button>
                }
            </div>

            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={translate('label.myAccount.rfq.cancelRFQ')}>
                <div className="mb-4">
                    {<label htmlFor="cancelComment" className="block mb-2 text-sm font-medium text-gray-700">{translate('label.myAccount.rfq.commentRequired')}</label>}
                    <input
                        className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={cancelComment}
                        onChange={(e) => setCancelComment(e.target.value)}
                        placeholder={translate('label.myAccount.rfq.enterReason')}
                    />
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn" onClick={() => setIsDialogOpen(false)}>{translate('label.myAccount.rfq.cancel')}</div>
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn btn-primary" onClick={handleCancelRFQ}>{translate('label.myAccount.rfq.confirmCancellation')}</div>
                </div>
            </Dialog>
        </div>
    )
}