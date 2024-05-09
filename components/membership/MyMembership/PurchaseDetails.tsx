// PurchaseDetails.jsx
import React from 'react';
import moment from 'moment';
import { useTranslation } from '@commerce/utils/use-translation';
import { DATE_FORMAT } from '@components/utils/constants';

const PurchaseDetails = ({ lastPurchase } :any) => {
  const translate = useTranslation()
  const formatDate = (dateString: string) => {
    return moment(dateString).format(DATE_FORMAT);
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col w-full h-50  justify-between">
      <h2 className="text-xl font-bold mb-4">{translate('label.membership.myMembershipPurchasesHeadingText')}</h2>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">{translate('label.membership.myMembershipPurchaseOnText')}</span> {formatDate(lastPurchase?.orderDate)}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">{translate('label.membership.myMembershipPurchaseOrderNo')}</span> {lastPurchase?.orderNo}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">{translate('label.membership.myMembershipPurchaseDeliveryDateText')}</span> {formatDate(lastPurchase?.dueDate)}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">{translate('label.membership.myMembershipPurchaseTotalCostText')}</span> {lastPurchase?.grandTotal?.formatted?.withTax}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">{translate('label.membership.myMembershipPurchaseYouSavedText')}</span> {lastPurchase?.discount?.formatted?.withTax}
      </p>
      <div className="mt-4">
        <a
          href="#"
          className="font-semibold text-slate-900 dark:text-slate-200"
        >
          {translate('label.membership.viewAllYourOrdersBtnText')}
        </a>
        <span className="mx-2">{translate('label.myAccount.orText')}</span>
        <a
          href="#"
          className="font-semibold text-slate-900 dark:text-slate-200"
        >
          {translate('label.membership.viewYourOrdersListBtnText')}
        </a>
      </div>
    </div>
  );
};

export default PurchaseDetails;