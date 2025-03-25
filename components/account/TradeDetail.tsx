'use client';

import { NEXT_TRADE_IN_GET_ASSESSMENT_STATUS, NEXT_TRADE_IN_GET_QUOTE_BY_ID, TradeInItemCondition } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Loader from "@components/Loader";
export default function TradeInDetail() {
  const router: any = useRouter();
  const [tradeDetail, setTradeDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lineAssessment, setLineAssessment] = useState(null)
  const [message, setMessage] = useState("")
  const tradeinId = router.query?.tradeinId[0]
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

  useEffect(() => {
    fetchTradeDetail(tradeinId);
  }, [tradeinId]);

  const fetchTradeDetail = async (tradeinId: string) => {
    setIsLoading(true);
    try {
      const quoteResult = await axios.post(NEXT_TRADE_IN_GET_QUOTE_BY_ID, { data: { id: tradeinId } })
      setTradeDetail(quoteResult?.data);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const setSuccessMessage = (data?: any) => {
    if (data) {
      setMessage(data)
    }
    // Automatically clear the message after 10 seconds
    setTimeout(() => {
      setMessage("");
    }, 4000);
  }
  const updateAssessmentStatus = async (id: string, status: number) => {
    setIsLoading(true);
    try {
      const statusResult = await axios.post(
        NEXT_TRADE_IN_GET_ASSESSMENT_STATUS,
        { id: id, status: status } // ✅ Correct
      );

      setLineAssessment(statusResult?.data);
      if (statusResult.data) {
        setSuccessMessage("Status update successfully!!!");
        fetchTradeDetail(tradeinId);
      }
    } catch (error) {
      setSuccessMessage("Something went wrong!!!");
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <Loader /> :
        <div className="flex flex-col w-full px-6 gp-5">
          {message != "" && <div className='fixed z-10 top-24 right-4'>
            <span className='px-4 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600'>{message}</span>
          </div>}
          <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
            <li className='flex items-center text-10-mob sm:text-sm'>
              <Link href="/my-account/tradein" passHref>
                <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" >Trade In</span>
              </Link>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
              </span>
            </li>
            <li className="flex items-center text-10-mob sm:text-sm" >
              <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
                {tradeDetail?.value?.quoteNo}
              </span>
            </li>
          </ol>
          <h2 className="text-xl font-normal sm:text-2xl dark:text-black">Trade-In Details</h2>
          <div className='flex flex-col w-full gap-4 border-t border-gray-200'>
            <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
              <h3 className="px-0 py-0 text-xl font-semibold flex gap-1 items-center w-full text-[#2d4d9c]">Quote Reference Number: {tradeDetail?.value?.quoteNo}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusClasses[tradeDetail?.value?.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
                  {tradeDetail?.value?.status ?? "Unknown"}
                </span>
              </h3>
              <p className='text-sm font-normal text-gray-600'>Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
              <p className='text-sm font-normal text-gray-600'>To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
            </div>
            <div className='flex flex-col justify-start w-full my-3 text-left'>
              <h3 className="text-xl font-semibold w-full text-[#2d4d9c] rounded disabled:bg-gray-300">Trade-in Summary</h3>
            </div>
          </div>
          <div className='flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                  {tradeDetail?.value?.status == "Assessed" && <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Assessment Price</th>}
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
                  {tradeDetail?.value?.status == "Assessed" && <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"></th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tradeDetail?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, itemIdx: number) => (
                  <tr key={`item-${itemIdx}`} className="bg-white hover:bg-gray-100">
                    <td className="flex gap-5 py-3 pl-4 pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                      <img src={item?.parentProductImageUrl} className='inline-block w-auto h-16' alt={item?.parentProductName} />
                      <div className='flex flex-col justify-center w-full gap-1 text-left'>
                        <span className="font-semibold text-left text-black">{item?.parentProductName} <span className="text-xs font-medium text-black">({item?.parentStockCode})</span></span>
                        {item?.condition != "" && <span className='text-xs text-left text-gray-600'><strong>Condition: </strong>{item?.condition == 1 ? TradeInItemCondition.WELL_USED : item?.condition == 2 ? TradeInItemCondition.GOOD : item?.condition == 3 ? TradeInItemCondition.LIKE_NEW : item?.condition == 4 ? TradeInItemCondition.VERY_GOOD : item?.condition == 5 ? TradeInItemCondition.EXCELLENT : ''}</span>}
                        {item?.accessories?.length > 0 &&
                          <span className='text-xs text-left text-gray-600'><strong>Accessories: </strong>
                            {item?.accessories?.map((acc: any, accId: number) => (
                              <span key={`accessories-${accId}`} className="pr-2">{acc?.name}</span>
                            ))}
                          </span>
                        }
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                      {"£"}{item?.price}
                    </td>
                    {tradeDetail?.value?.status == "Assessed" && <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                      {"£"}{item?.assessmentPrice}
                    </td>}
                    <td className={`whitespace-nowrap justify-end pr-2`} align="right">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusClasses[item.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
                        {item.status ?? "Unknown"}
                      </span>
                    </td>
                    {tradeDetail?.value?.status == "Assessed" &&
                      <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                        <div className="flex justify-end gap-2 pr-3">
                          <button onClick={() => updateAssessmentStatus(item?.assessmentId, 8)} className="px-2 py-1 text-xs text-white bg-red-600 rounded">Reject</button>
                          <button onClick={() => updateAssessmentStatus(item?.assessmentId, 7)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600">Accept</button>
                        </div>
                      </td>
                    }
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="py-3 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">
                    £{tradeDetail?.value?.grandTotal}
                  </td>
                  {tradeDetail?.value?.status == "Assessed" && <th scope="col" className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">£{tradeDetail?.value?.assessmentTotal}</th>}
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
                  {tradeDetail?.value?.status == "Assessed" && <th scope="col" className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></th>}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className='flex flex-col justify-start w-full gap-4 mt-6 text-left'>
            <p className='text-sm font-normal text-gray-600'>If in the meantime you decide that you would rather a collections be organized please call us on 01444 237070 or email us at sales@parkcameras.com and someone will be willing to help you change the shipping method.</p>
            <p className='text-sm font-normal text-gray-600'>Before coming into store, why not check out our extensive range of camera gear.</p>
          </div>
        </div>
      }
    </>
  );
}
