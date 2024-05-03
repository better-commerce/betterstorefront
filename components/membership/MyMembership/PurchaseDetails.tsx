// PurchaseDetails.jsx
import React from 'react';
import moment from 'moment';

const PurchaseDetails = ({ lastPurchase } :any) => {

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMMM Do YYYY');
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col h-50  justify-between">
      <h2 className="text-xl font-bold mb-4">My Membership Purchases</h2>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">purchase on:</span> {formatDate(lastPurchase?.orderDate)}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">Order:</span> {lastPurchase?.orderNo}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">Delivery:</span> {formatDate(lastPurchase?.dueDate)}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">Total cost:</span> {lastPurchase?.grandTotal?.formatted?.withTax}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-slate-900 dark:text-slate-200">You saved:</span> {lastPurchase?.discount?.formatted?.withTax}
      </p>
      <div className="mt-4">
        <a
          href="#"
          className="font-semibold text-slate-900 dark:text-slate-200"
        >
          View all your orders
        </a>
        <span className="mx-2">OR</span>
        <a
          href="#"
          className="font-semibold text-slate-900 dark:text-slate-200"
        >
          View your order list
        </a>
      </div>
    </div>
  );
};

export default PurchaseDetails;