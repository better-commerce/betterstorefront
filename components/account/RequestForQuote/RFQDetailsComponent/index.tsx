
import { useTranslation } from "@commerce/utils/use-translation";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog } from '@components/account/RequestForQuote/RFQCancleDialog';
import { NEXT_UPDATE_STATUS_RFQ } from "@components/utils/constants";
import { AlertType } from "@framework/utils/enums";
import { useUI } from "@components/ui";


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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                {translate('label.myAccount.rfq.requestForQuote')} {rfqData?.RFQNumber && "#" + rfqData?.RFQNumber}
            </h1>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p><strong>{translate('label.myAccount.rfq.status')}:</strong> {rfqData?.status}</p>
                <p><strong>{translate('label.myAccount.rfq.name')}:</strong> {rfqData?.firstName} {rfqData?.lastName}</p>
                <p><strong>{translate('label.myAccount.rfq.email')}:</strong> {rfqData?.email || translate('label.myAccount.rfq.notAvailable')}</p>
                <p><strong>{translate('label.myAccount.rfq.company')}:</strong> {rfqData?.companyName}</p>
                {rfqData?.notes && <p><strong>{translate('label.myAccount.rfq.notes')}:</strong> {rfqData?.notes}</p>}
            </div>

            <h2 className="text-xl font-semibold mb-2">{translate('label.myAccount.rfq.lineItems')}</h2>
            <table className="w-full mb-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">{translate('label.myAccount.rfq.stockCode')}</th>
                        <th className="p-2 text-left">{translate('label.myAccount.rfq.productName')}</th>
                        <th className="p-2 text-left">{translate('label.myAccount.rfq.quantity')}</th>
                        <th className="p-2 text-left">{translate('label.myAccount.rfq.price')}</th>
                        <th className="p-2 text-left">{translate('label.myAccount.rfq.targetPrice')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rfqData?.lines?.map?.((item: any, index: any) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{item?.stockCode}</td>
                            <td className="p-2">{item?.productName}</td>
                            <td className="p-2">{item?.qty}</td>
                            <td className="p-2">{item?.price ? `${item?.price.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
                            <td className="p-2">{item?.targetPrice ? `${item?.targetPrice.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between">
                <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn" onClick={() => router?.back()}>{translate('label.myAccount.rfq.backToList')}</div>
                {(rfqData.status !== 'Cancelled') && <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn btn-primary" onClick={() => setIsDialogOpen(true)}>{translate('label.myAccount.rfq.cancelRFQ')}</div>}
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
                <div className="flex justify-end space-x-2 mt-4">
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn" onClick={() => setIsDialogOpen(false)}>{translate('label.myAccount.rfq.cancel')}</div>
                    <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn btn-primary" onClick={handleCancelRFQ}>{translate('label.myAccount.rfq.confirmCancellation')}</div>
                </div>
            </Dialog>
        </div>
    )
}