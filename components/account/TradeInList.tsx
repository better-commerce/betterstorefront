'use client';
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Pagination = dynamic(() => import('@components/Product/Pagination'))
import Loader from "@components/Loader";
import { NEXT_TRADE_IN_CUSTOMER_TRADES } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";

export default function TradeInTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [tradeList, setTradeList] = useState<any>([])
  const statusClasses: Record<string, string> = {
    AwaitingQuotation: "bg-gray-100 border-gray-500 text-gray-500", // Waiting for quotation
    Quoted: "bg-sky-200 border-sky-500 text-sky-500", // Quotation provided
    QuoteAccepted: "bg-emerald-200 border-emerald-500 text-emerald-500", // Quote accepted by customer
    QuoteRejected: "bg-red-200 border-red-500 text-red-500", // Quote rejected
    QuoteExpired: "bg-orange-200 border-orange-500 text-orange-500", // Expired quote
    CollectionArranged: "bg-indigo-200 border-indigo-500 text-indigo-500", // Collection scheduled
    ParcelArrived: "bg-teal-200 border-teal-500 text-teal-500", // Parcel received
    Assessment: "bg-yellow-100 border-yellow-300 text-yellow-500", // Under assessment
    FurtherAssessment: "bg-yellow-200 border-yellow-400 text-yellow-600", // Needs further review
    Assessed: "bg-emerald-600 border-emerald-700 text-emerald-100", // Assessment complete
    AssessmentApproved: "bg-emerald-100 border-emerald-300 text-emerald-500", // Approved assessment
    AssessedFullReject: "bg-red-300 border-red-600 text-red-600", // Fully rejected after assessment
    AssessedPartialReject: "bg-orange-300 border-orange-600 text-orange-600", // Partially rejected
    TradeInComplete: "bg-emerald-300 border-emerald-600 text-emerald-600", // Trade-in completed
    TradeInFullReject: "bg-red-400 border-red-700 text-red-700", // Full rejection
    TradeInPartialReject: "bg-orange-400 border-orange-700 text-orange-700", // Partial rejection
    CompleteBookedIntoStock: "bg-purple-200 border-purple-500 text-purple-500", // Stocked after trade-in
    FullReturn: "bg-red-500 border-red-700 text-white", // Full return processed
    CompleteBookedIntoStockPartialReturn: "bg-orange-500 border-orange-700 text-white", // Partial return processed
    QuoteCancelled: "bg-gray-400 border-gray-600 text-gray-600", // Quote was canceled
    Submitted: "bg-sky-300 border-sky-600 text-sky-600", // Submitted request
    PriceNeeded: "bg-yellow-400 border-yellow-700 text-yellow-700", // Price not available yet
    Accepted: "bg-emerald-200 border-emerald-500 text-emerald-500", // Offer accepted
    Rejected: "bg-red-500 border-red-700 text-white", // Offer rejected
    Expired: "bg-orange-500 border-orange-700 text-white", // Expired status
    AssessmentInProgress: "bg-yellow-200 border-yellow-500 text-yellow-500", // Still being assessed
    RejectedByBusiness: "bg-red-600 border-red-800 text-white", // Rejected by company
    AssessmentRejectedByCustomer: "bg-red-300 border-red-600 text-red-600", // Rejected by customer
    Completed: "bg-emerald-800 border-emerald-800 text-white", // Fully completed
  };
  const [paginationState, setPaginationState] = useState<any>({ pageNumber: 1, pageSize: 10, sortBy: 'created_on', sortDescending: true, pageCount: 1 })
  const fetchAllTrades = async (page = 1) => {
    setIsLoading(true)
    try {
      const { pageCount, ...rest } = paginationState
      const params = { ...rest, pageNumber: page }
      const { data: allTrades } = await axios.get(NEXT_TRADE_IN_CUSTOMER_TRADES, { params })
      setPaginationState((prev: any) => ({ ...prev, pageNumber: allTrades?.page, pageCount: allTrades?.totalPages, pageSize: allTrades?.pageSize }))
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
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700 border">Quote</th>
                    <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Status</th>
                    <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Total</th>
                    <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border">Created</th>
                    <th className="px-4 py-2 text-sm font-semibold text-right text-gray-700 border"></th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {tradeList?.items.map((item: any, index: number) => (
                    <tr key={index} className="text-xs bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm font-semibold text-black border">
                        <Link href={`/my-account/tradein/${item?.id}`} passHref className="text-sm text-sky-600">
                          {item.quoteNo || '-'}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-right border">
                        <span className={`px-2 py-1 text-[11px] font-medium rounded-full border ${statusClasses[item?.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
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
            </div>
            <Pagination currentPage={paginationState.pageNumber} onPageChange={({ selected }: any) => fetchAllTrades(selected + 1 || 1)} pageCount={paginationState.pageCount} />
          </>
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
