'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loader from "@components/Loader";
import { AssessmentStatus, NEXT_TRADE_IN_CUSTOMER_TRADES, QuoteItemStatus, QuoteStatus } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";
const Pagination = dynamic(() => import('@components/Product/Pagination'))

export default function TradeInTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [tradeList, setTradeList] = useState<any>([])
  const statusClasses: Record<string, string> = {
    // QuoteStatus
    AwaitingQuotation: "bg-gray-100 border-gray-500 text-gray-500",
    Quoted: "bg-sky-200 border-sky-500 text-sky-500",
    QuoteAccepted: "bg-emerald-200 border-emerald-500 text-emerald-500",
    QuoteRejected: "bg-red-100 border-red-300 text-red-600",
    QuoteExpired: "bg-orange-200 border-orange-500 text-orange-500",
    CollectionArranged: "bg-indigo-200 border-indigo-500 text-indigo-500",
    ParcelArrived: "bg-teal-200 border-teal-500 text-teal-500",
    Assessment: "bg-yellow-100 border-yellow-300 text-yellow-500",
    FurtherAssessment: "bg-yellow-200 border-yellow-400 text-yellow-600",
    Assessed: "bg-emerald-600 border-emerald-700 text-emerald-100",
    TradeInComplete: "bg-emerald-900 border-emerald-900 text-emerald-100",
    AssessedFullReject: "bg-red-100 border-red-300 text-red-600",
    AssessedPartialReject: "bg-orange-100 border-orange-300 text-orange-600",
    TradeInFullReject: "bg-red-100 border-red-300 text-red-600",
    TradeInCompletePartialReject: "bg-orange-200 border-orange-400 text-orange-600",
    CompleteBookedIntoStock: "bg-purple-200 border-purple-500 text-purple-500",
    CompleteBookedIntoStockPartialReturn: "bg-orange-500 border-orange-700 text-white",
    FullReturn: "bg-red-500 border-red-700 text-white",
    TradeInCompleteFullReturn: "bg-fuchsia-200 border-fuchsia-400 text-fuchsia-600",
    CancelledByCustomer: "bg-red-100 border-red-400 text-red-600",
    CancelledByBusiness: "bg-red-100 border-red-400 text-red-700",

    // QuoteItemStatus
    Submitted: "bg-sky-300 border-sky-600 text-sky-600",
    PriceNeeded: "bg-yellow-200 border-yellow-500 text-yellow-700",
    Accepted: "bg-emerald-200 border-emerald-500 text-emerald-500",
    Rejected: "bg-red-100 border-red-300 text-red-600",
    Expired: "bg-orange-500 border-orange-700 text-white",
    AssessmentInProgress: "bg-yellow-200 border-yellow-500 text-yellow-500",
    AssessedRejectedByBusiness: "bg-red-100 border-red-300 text-red-600",
    AssessedRejectedByCustomer: "bg-red-100 border-red-300 text-red-600",
    AssessmentAccepted: "bg-emerald-100 border-emerald-300 text-emerald-500",
    StockBookedIn: "bg-purple-300 border-purple-600 text-purple-600",

    // AssessmentStatuses
    Pending: "bg-gray-100 border-gray-400 text-gray-500",
    InProgress: "bg-blue-300 border-blue-500 text-blue-500",
    AccessoriesChecked: "bg-teal-300 border-teal-500 text-teal-500",
    ItemChecked: "bg-indigo-300 border-indigo-500 text-indigo-500",
    ImagesUploaded: "bg-orange-300 border-orange-500 text-orange-500",
    Approved: "bg-green-300 border-green-500 text-green-500",
    RejectedByCustomer: "bg-red-100 border-red-500 text-red-500",
    RejectedByBusiness: "bg-red-100 border-red-600 text-red-600",
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
  // Function to convert status to a user-friendly format
  const getStatusLabel = (status: string): string => {
    return status
      ?.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/_/g, " ") // Replace underscores with spaces (if any)
      .trim();
  };
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
                        <Link href={`/my-account/tradein/${item?.id}`} passHref className="text-sm text-sky-600">{item.quoteNo || '-'}</Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-right border">
                        <span className={`px-2 py-1 text-[11px] font-medium rounded-full border ${statusClasses[item?.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
                          {getStatusLabel(item?.status ?? "Unknown")}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right border">{item.grandTotal > 0 ? `£${item?.grandTotal}` : ''}</td>
                      <td className="px-4 py-2 text-sm text-right border">{new Date(item.created).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right border">
                        <Link href={`/my-account/tradein/${item?.id}`} passHref className="text-sm underline text-sky-600">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={paginationState.pageNumber} onPageChange={({ selected }: any) => fetchAllTrades(selected + 1 || 1)} pageCount={paginationState.pageCount} />
            <p className="mt-6 text-xs text-left text-gray-600">
              We hope you like our new Trade In section of our website. We're still working on improvements, but if you spot something that's not working as expected, please send us an email with screenshots (if possible) to <a href="mailto:websitefeedback@parkcameras.com" className="text-sky-600">websitefeedback@parkcameras.com</a>.
              If you have a query, please email <a href="mailto:sales@parkcameras.com" className="text-sky-600">sales@parkcameras.com</a>.
            </p>
          </>
        ) : (
          <div className="flex flex-col justify-center gap-4 text-center">
            <h3 className="py-4 text-2xl font-semibold text-center text-gray-600">No Trade Available.</h3>
            <p className="mt-6 text-xs text-left text-gray-600">
              We hope you like our new Trade In section of our website. We're still working on improvements, but if you spot something that’s not working as expected, please send us an email with screenshots (if possible) to <a href="mailto:websitefeedback@parkcameras.com" className="text-sky-600">websitefeedback@parkcameras.com</a>.
              If you have a query, please email <a href="mailto:sales@parkcameras.com" className="text-sky-600">sales@parkcameras.com</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
