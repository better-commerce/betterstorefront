import React, { useState, useEffect } from 'react';
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AlertType } from '@framework/utils/enums';
import { useTranslation } from "@commerce/utils/use-translation";
import Spinner from '@components/ui/Spinner';
import { useUI } from '@components/ui';
import axios from 'axios';
import { NEXT_GET_DETAILS_RFQ, NEXT_UPDATE_STATUS_RFQ } from '@components/utils/constants';
import LayoutAccount from '@components/Layout/LayoutAccount'

interface RFQItem {
  productId : string,
  stockCode: string,
  productName : string,
  qty : number,
  price : number,
  targetPrice : number
} 

interface RFQData {
  RFQNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  notes: string;
  lines: RFQItem[];
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

  const variantClasses = {
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  </div>
);

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const RFQDetailsPage: any = ({}) => {
  const router = useRouter();
  const rfqId = router?.query?.rfqId?.[0];
  const translate = useTranslation();
  const { setAlert } = useUI();
  const [rfqData, setRfqData] = useState<RFQData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelComment, setCancelComment] = useState('');

  useEffect(() => {
    if (rfqId) {
      fetchRFQData();
    }
  }, [rfqId]);

  const fetchRFQData = async () => {
    setIsLoading(true);
    try {
      const response: any = await axios.post(NEXT_GET_DETAILS_RFQ, { rfqId });
      setRfqData(response?.data);
    } catch (err) {
      setAlert({ type: AlertType.ERROR, msg: translate('label.myAccount.rfq.requestCouldNotProcessErrorMsg') });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return <Spinner />;
  }

  if (!rfqData) {
    setAlert({ type: AlertType.ERROR, msg: translate('label.myAccount.rfq.requestCouldNotProcessErrorMsg') });
    return <>NO DATA</>;
  }

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
        <p><strong>{translate('label.myAccount.rfq.notes')}:</strong> {rfqData?.notes}</p>
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
          {rfqData?.lines?.map?.((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item?.stockCode}</td>
              <td className="p-2">{item?.productName}</td>
              <td className="p-2">{item?.qty}</td>
              <td className="p-2">{item?.price ? `$${item?.price.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
              <td className="p-2">{item?.targetPrice ? `$${item?.targetPrice.toFixed(2)}` : translate('label.myAccount.rfq.notAvailable')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <Button onClick={() => router.back()}>{translate('label.myAccount.rfq.backToList')}</Button>
        <Button onClick={() => setIsDialogOpen(true)} variant="danger">{translate('label.myAccount.rfq.cancelRFQ')}</Button>
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={translate('label.myAccount.rfq.cancelRFQ')}>
        <Input
          label={translate('label.myAccount.rfq.commentRequired')}
          id="cancelComment"
          value={cancelComment}
          onChange={(e) => setCancelComment(e.target.value)}
          placeholder={translate('label.myAccount.rfq.enterReason')}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{translate('label.myAccount.rfq.cancel')}</Button>
          <Button variant="danger" onClick={handleCancelRFQ}>{translate('label.myAccount.rfq.confirmCancellation')}</Button>
        </div>
      </Dialog>
    </div>
  );
};

RFQDetailsPage.LayoutAccount = LayoutAccount;
export default withDataLayer(withAuth(RFQDetailsPage), PAGE_TYPES.RequestQuote, true, LayoutAccount);
