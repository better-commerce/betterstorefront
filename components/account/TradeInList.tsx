'use client';

import Loader from "@components/Loader";
import { NEXT_TRADE_IN_CUSTOMER_TRADES } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TradeInTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [tradeList, setTradeList] = useState<any>([])
  const statusClasses: Record<string, string> = {
    AwaitingQuotation: "bg-gray-200 border-gray-500 text-gray-500", // Waiting for quotation
    Quoted: "bg-sky-200 border-sky-500 text-sky-500", // Quotation provided
    QuoteAccepted: "bg-emerald-200 border-emerald-500 text-emerald-500", // Quote accepted by customer
    QuoteRejected: "bg-red-200 border-red-500 text-red-500", // Quote rejected
    QuoteExpired: "bg-yellow-200 border-yellow-500 text-yellow-500", // Expired quote
    CollectionArranged: "bg-indigo-200 border-indigo-500 text-indigo-500", // Collection scheduled
    ParcelArrived: "bg-teal-200 border-teal-500 text-teal-500", // Parcel received
    Assessment: "bg-orange-200 border-orange-500 text-orange-500", // Under assessment
    FurtherAssessment: "bg-orange-300 border-orange-600 text-orange-600", // Needs further review
    Assessed: "bg-lime-100 border-lime-500 text-lime-600", // Assessment complete
    AssessmentApproved: "bg-emerald-200 border-emerald-500 text-emerald-500", // Approved assessment
    AssessedFullReject: "bg-red-300 border-red-600 text-red-600", // Fully rejected after assessment
    AssessedPartialReject: "bg-yellow-300 border-yellow-600 text-yellow-600", // Partially rejected
    TradeInComplete: "bg-emerald-300 border-emerald-600 text-emerald-600", // Trade-in completed
    TradeInFullReject: "bg-red-400 border-red-700 text-red-700", // Full rejection
    TradeInPartialReject: "bg-yellow-400 border-yellow-700 text-yellow-700", // Partial rejection
    CompleteBookedIntoStock: "bg-purple-200 border-purple-500 text-purple-500", // Stocked after trade-in
    FullReturn: "bg-red-500 border-red-700 text-white", // Full return processed
    CompleteBookedIntoStockPartialReturn: "bg-yellow-500 border-yellow-700 text-white", // Partial return processed
    QuoteCancelled: "bg-gray-400 border-gray-600 text-gray-600", // Quote was canceled
    Submitted: "bg-sky-300 border-sky-600 text-sky-600", // Submitted request
    PriceNeeded: "bg-orange-400 border-orange-700 text-orange-700", // Price not available yet
    Accepted: "bg-emerald-400 border-emerald-700 text-emerald-700", // Offer accepted
    Rejected: "bg-red-500 border-red-700 text-white", // Offer rejected
    Expired: "bg-yellow-500 border-yellow-700 text-white", // Expired status
    AssessmentInProgress: "bg-orange-500 border-orange-700 text-white", // Still being assessed
    RejectedByBusiness: "bg-red-600 border-red-800 text-white", // Rejected by company
    AssessmentRejectedByCustomer: "bg-purple-300 border-purple-600 text-purple-600", // Rejected by customer
    Completed: "bg-emerald-500 border-emerald-700 text-white", // Fully completed
  };
  const fetchAllTrades = async () => {
    setIsLoading(true)
    try {
      const { data: allTrades } = await axios.get(NEXT_TRADE_IN_CUSTOMER_TRADES)
      setTradeList(allTrades)
      setIsLoading(false)
    } catch (error) {
      logError(error)
      setIsLoading(false)
    }
  };
  // Call fetchAllTrades on component mount
  useEffect(() => {
    fetchAllTrades();
  }, []);
  return (
    <div className="w-full px-6">
      {isLoading && <Loader />}
      <h2 className="text-xl font-normal sm:text-2xl dark:text-black">My Trade In</h2>
      <div className="mt-4 overflow-x-auto">
        {tradeList?.items?.length > 0 ? (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">Quote</th>
                <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Status</th>
                <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Total</th>
                <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Created</th>
                <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border"></th>
              </tr>
            </thead>
            <tbody>
              {tradeList?.items.map((item: any, index: number) => (
                <tr key={index} className="text-left border">
                  <td className="px-4 py-2 text-sm font-semibold text-black border">
                    <Link href={`/my-account/tradein/${item?.id}`} passHref className="text-sm text-sky-600">
                      {item.quoteNo || '-'}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-sm text-right border">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusClasses[item?.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
                      {item?.status ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-right border">{item.grandTotal > 0 ? `£${item?.grandTotal}` : ''}</td>
                  <td className="px-4 py-2 text-sm text-right border">
                    {new Date(item.created).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right border">
                    <Link href={`/my-account/tradein/${item?.id}`} passHref className="text-sm underline text-sky-600">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-4 text-center text-gray-600">No trade-in records found.</p>
        )}
      </div>

      {/* Footer Text */}
      <p className="mt-6 text-xs text-left text-gray-600">
        We hope you like our new Trade In section of our website. We're still working on improvements,
        but if you spot something that’s not working as expected, please send us an email with
        screenshots (if possible) to <a href="mailto:websitefeedback@parkcameras.com" className="text-sky-600">websitefeedback@parkcameras.com</a>.
        If you have a query, please email <a href="mailto:sales@parkcameras.com" className="text-sky-600">sales@parkcameras.com</a>.
      </p>
    </div>
  );
}
