'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosRequestConfig } from "axios";
import Loader from "@components/Loader";
import { logError } from "@framework/utils/app-util";
import { useRouter } from 'next/router'
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { AssessmentStatusType, EmptyGuid, NEXT_TRADE_IN_GET_ASSESSMENT_STATUS, NEXT_TRADE_IN_GET_QUOTE_BY_ID, NEXT_TRADE_IN_QUOTE_CANCEL_BY_CUSTOMER, NEXT_TRADE_IN_QUOTE_LINE_LEVEL_STATUS, QuoteItemStatusType, QuoteStatusType, TradeInItemCondition } from "@components/utils/constants";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { callApi } from "@framework/utils/api-util";

export default function TradeInDetail() {
  const router: any = useRouter();
  const [tradeDetail, setTradeDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>({});
  const [rejectReasons, setRejectReasons] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("")
  const tradeinId = router.query?.tradeinId[0]

  const rejectionOptions = [
    { id: 1, value: "Offer too low" },
    { id: 2, value: "Better offer elsewhere" },
    { id: 3, value: "Change of mind" },
    { id: 4, value: "Just getting an idea" }
  ];

  const notes = [
    {
        "noteId": "db542e4b-64f7-497f-b30b-17ab321742a3",
        "stageId": 1,
        "stage": "AccessroyUpdated",
        "notes": "asdf",
        "createdBy": "sanjay@devpc.com",
        "createdOn": "05/14/2025 12:30:46"
    },
    {
        "noteId": "1c8a23a5-eb97-4731-a1a6-80ce2184c5c9",
        "stageId": 2,
        "stage": "ChecklistUpdated",
        "notes": "asdf",
        "createdBy": "sanjay@devpc.com",
        "createdOn": "05/14/2025 12:30:52"
    },
    {
        "noteId": "de8157c9-980a-4e13-baae-99554a85b0e3",
        "stageId": 3,
        "stage": "Submitted",
        "notes": "asdf",
        "createdBy": "sanjay@devpc.com",
        "createdOn": "05/14/2025 12:30:56"
    }
]

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

  useEffect(() => {
    fetchTradeDetail(tradeinId);
  }, [tradeinId]);

  const fetchTradeDetail = async (tradeinId: string) => {
    setIsLoading(true);
    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_GET_QUOTE_BY_ID, method: RequestMethod.POST, data: { id: tradeinId } }; 
      const quoteResult = await callApi(config)
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
    setTimeout(() => { setMessage(""); }, 4000);
  }
  const updateAssessmentStatus = async (id: string, status: number) => {
    setIsLoading(true);
    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_GET_ASSESSMENT_STATUS, method: RequestMethod.POST, data: { id: id, status: status } };
      const statusResult = await callApi(config);
      if (statusResult.data) {
        setSuccessMessage("Status update successfully!!!");
        fetchTradeDetail(tradeinId);
      }
    } catch (error) {
      setSuccessMessage("Something went wrong!!!");
      logError(error);
    } finally {
      //setIsLoading(false);
    }
  };

  const handleItemAction = async (itemId: any, status: number) => {
    if (status === QuoteItemStatusType.REJECTED && !rejectReasons[itemId]) {
      setMessage("Please select reject reasons!!");
      setTimeout(() => { setMessage(""); }, 3000);
      return;
    }
    setIsLoading(true);
    try {
      if (tradeDetail?.value?.id) {
        const requestBody = {
          id: tradeDetail?.value?.id,
          itemId: itemId,
          status,
          rejectionReason: status === QuoteItemStatusType.ACCEPTED ? QuoteItemStatusType.SUBMITTED : rejectReasons[itemId],
        };

        const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_QUOTE_LINE_LEVEL_STATUS, method: RequestMethod.POST, data: requestBody };
        const quoteResult = await callApi(config)
        setTradeDetail(quoteResult?.data);
        await fetchTradeDetail(tradeDetail?.value?.id);
      } else {
        logError("No quoteId received in response.")
      }
    } catch (error) {
      logError(error)
    } finally {
      //setIsLoading(false);
    }
  };

  const handleCancelQuote = async (quoteId: any, status: number) => {
    setIsLoading(true)
    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_QUOTE_CANCEL_BY_CUSTOMER, method: RequestMethod.POST, data: { id: quoteId, status: status } };
      const quoteResult = await callApi(config)
      setTradeDetail(quoteResult?.data);
      await fetchTradeDetail(tradeDetail?.value?.id);
    }
    catch (error) {
      logError(error)
    } finally {
      setIsLoading(false)
    }
  }
  // At the top of your component (or within the render), define helper variables:
  const status = tradeDetail?.value?.status;
  const showAssessmentPrice = status === "Assessed" || status === "AssessmentApproved" || status === "AssessedPartialReject" || status === "AssessmentAccepted" || status === "TradeInComplete" || status === "TradeInFullReject" || status === "TradeInCompletePartialReject" || status === "AssessedFullReject";
  const showActionColumn = status === "Assessed" || status === "Quoted" || status === "AssessedPartialReject" || status === "TradeInCompletePartialReject";

  const conditionMapping: { [key: number]: string } = {
    1: "Like New",
    2: "Excellent",
    3: "Very Good",
    4: "Good",
    5: "Well Used",
  };
  // Function to convert status to a user-friendly format
  const getStatusLabel = (status: string): string => {
    return status
      ?.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/_/g, " ") // Replace underscores with spaces (if any)
      .trim();
  };
  const canChangeStatus = (itemStatus: string) => !["Rejected", "AssessmentApproved", "AssessedPartialReject", "AssessmentRejectedByCustomer", "AssessmentAccepted", "CancelledByBusiness", "CancelledByCustomer", "AssessedRejectedByBusiness"].includes(itemStatus);
  const canCancelTradeIn = (itemStatus: string) => ["AwaitingQuotation", "Quoted", "QuoteAccepted", "QuoteExpired"].includes(itemStatus);
  const renderProductInfo = (product: any, accessories: any, condition: any) => (
    <div className="flex items-center justify-start gap-2">
      <img src={product?.parentProductImageUrl} className="inline-block w-auto h-16 border border-gray-300 rounded-md shadow" alt={product?.parentProductName} />
      <div className="flex flex-col">
        <span className="font-semibold text-black text-wrap">
          {product?.parentProductName}{" "}
          <span className="text-xs font-medium text-black">{product?.parentStockCode != "DP000001" && <span>({product?.parentStockCode})</span>}</span>
        </span>
        {condition != "" && (
          <span className="text-xs text-gray-600"> <strong>Condition: </strong>
            {condition == TradeInItemCondition.WELL_USED ? 'Well Used' :
              condition == TradeInItemCondition.GOOD ? 'Good' : condition == TradeInItemCondition.VERY_GOOD ? 'Very Good' : condition == TradeInItemCondition.EXCELLENT ? 'Excellent' : condition == TradeInItemCondition.LIKE_NEW ? 'Like New' : 'N/A'
            }
          </span>
        )}
        {accessories?.length > 0 && (
          <span className="text-xs text-gray-600">
            <strong>Accessories: </strong>
            {[...accessories].sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sort alphabetically
              .map((acc: any) => acc?.name) // Extract names
              .join(", ")}
          </span>
        )}
        {product?.notes?.length > 0 && (
          <span className="text-xs text-gray-600">
            <strong>Assessmnet Notes: </strong>
            {[...product?.notes].sort((a: any, b: any) => a.stage.localeCompare(b.stage)) // Sort alphabetically
              .map((acc: any) => (
                <p key={acc?.noteId}>
                  <span className="font-semibold ms-2">{acc?.stage}</span> : {acc?.notes}
                </p>
              )) // Extract notes
            }
          </span>
        )}
      </div>
    </div>
  );
  return (
    <>
      {isLoading ? <Loader /> :
        <div className="flex flex-col w-full px-6 gp-5">
          {message != "" && <div className='fixed z-10 top-24 right-4'>
            <span className='px-4 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600'>{message}</span>
          </div>}
          <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0">
            <li className='flex items-center text-10-mob sm:text-sm'>
              <Link href="/my-account/tradein" passHref>
                <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500">Trade In</span>
              </Link>
            </li>
            <li className='flex items-center text-10-mob sm:text-sm'>
              <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black">
                <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
              </span>
            </li>
            <li className="flex items-center text-10-mob sm:text-sm" >
              <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`}>
                {tradeDetail?.value?.quoteNo}
              </span>
            </li>
          </ol>
          <div className="flex justify-between w-full pb-1 mb-1">
            <h3 className="px-0 py-0 text-xl font-semibold flex gap-1 items-center text-[#2d4d9c]">Trade-in Quote: {tradeDetail?.value?.quoteNo}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusClasses[tradeDetail?.value?.status] || 'bg-gray-200 border-gray-500 text-gray-500'}`}>
                {getStatusLabel(tradeDetail?.value?.status ?? "Unknown")}
              </span>
            </h3>
            {canCancelTradeIn(tradeDetail?.value?.status) && <button onClick={() => handleCancelQuote(tradeDetail?.value?.id, QuoteStatusType.CANCELLED_BY_CUSTOMER)} className="px-4 py-1 text-xs font-semibold text-red-600 border border-red-500 rounded-full bg-red-50 hover:text-white hover:bg-red-600">Cancel Quote</button>}
          </div>
          <div className='flex flex-col w-full gap-4 border-t border-gray-200'>
            <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
              <p className="text-sm font-normal text-gray-600">Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
              <p className="text-sm font-normal text-gray-600">To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
            </div>
            <div className="flex flex-col justify-start w-full my-3 text-left">
              <h3 className="text-xl font-semibold w-full text-[#2d4d9c] rounded disabled:bg-gray-300">Summary</h3>
            </div>
          </div>
          <div className="flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                  {showAssessmentPrice && (
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Assessment Price</th>
                  )}
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
                  {showActionColumn && (
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"></th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tradeDetail?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName)).map((item: any, itemIdx: number) => (
                  <tr key={`item-${itemIdx}`} className={`${item?.status?.includes("Reject") ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-gray-100'}`}>
                    <td className="flex gap-5 py-3 pl-4 pr-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap sm:pl-6">
                      <div className="flex flex-col justify-center w-full gap-1 text-left">
                        {item?.assessment?.assessmentId !== EmptyGuid ? (
                          <div className="flex flex-col w-full gap-1">
                            {item?.parentStockCode != item?.assessment?.parentStockCode && item?.assessment?.parentStockCode != null && <span className="text-xs font-semibold text-orange-600 uppercase">Selected Product:</span>}
                            <div className="flex flex-col w-full mb-3">
                              {renderProductInfo(item, item?.accessories, item?.condition)}
                            </div>
                            {item?.parentStockCode != item?.assessment?.parentStockCode && item?.assessment?.parentStockCode != null  &&
                              <>
                                <span className="text-xs font-semibold text-[#2d4d9c] uppercase">Updated product during assessment: </span>
                                <div className="flex items-center justify-start gap-2 p-2 bg-white border border-gray-200 rounded-md">
                                  <img src={item?.assessment?.parentProductImageUrl} className="inline-block w-auto h-12" alt={item?.assessment?.parentProductName} />
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-black text-wrap">
                                      {item?.assessment?.parentProductName}{" "}
                                      <span className="text-xs font-medium text-black">{item?.assessment?.parentStockCode != "DP000001" && <span>({item?.assessment?.parentStockCode})</span>}</span>
                                    </span>
                                    {item?.assessment?.assessmentCondition && (
                                      <span className="text-xs text-gray-600"> <strong>Condition: </strong>
                                        {item?.assessment?.assessmentCondition == TradeInItemCondition.WELL_USED ? 'Well Used' :
                                          item?.assessment?.assessmentCondition == TradeInItemCondition.GOOD ? 'Good' : item?.assessment?.assessmentCondition == TradeInItemCondition.VERY_GOOD ? 'Very Good' : item?.assessment?.assessmentCondition == TradeInItemCondition.EXCELLENT ? 'Excellent' : item?.assessment?.assessmentCondition == TradeInItemCondition.LIKE_NEW ? 'Like New' : 'N/A'
                                        }
                                      </span>
                                    )}
                                    {item?.accessories?.length > 0 && (
                                      <span className="text-xs text-left text-gray-600">
                                        <strong>Accessories: </strong>
                                        {item.accessories
                                          .sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sort alphabetically
                                          .map((acc: any) => acc?.name) // Extract names
                                          .join(", ") // Join with commas
                                        }
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </>
                            }
                          </div>
                        ) : (
                          <div className="flex flex-col w-full gap-1">
                            {renderProductInfo(item, item?.accessories, item?.condition)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">£{item?.price}</td>
                    {showAssessmentPrice && (
                      <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">£{item?.assessmentPrice}</td>
                    )}
                    <td className="pr-2 whitespace-nowrap" align="right">
                      <span className={`px-2 py-1 text-[11px] font-medium rounded-full border ${statusClasses[item.status] || "bg-gray-200 border-gray-500 text-gray-500"}`} >
                        {getStatusLabel(item.status ?? "Unknown")}
                      </span>
                      {(item.itemStatusId === QuoteItemStatusType.REJECTED && item.rejectionReason) && 
                        <span className="block px-2 text-[11px] font-medium">{`(${getStatusLabel(item.rejectionReason)})`}</span>
                      }
                    </td>
                    {showActionColumn && (
                      <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                        {(status === "Assessed" || status === "AssessedPartialReject" || status === "TradeInCompletePartialReject") && (item?.status === "Assessed" || item.status === "Quoted") ? (
                          canChangeStatus(item?.status) && (
                            <div className="flex justify-end gap-2 pr-3">
                              <button onClick={() => updateAssessmentStatus(item?.assessment?.assessmentId, AssessmentStatusType.REJECTED_BY_CUSTOMER)} className="px-2 py-1 text-xs text-white bg-red-600 rounded">Reject</button>
                              <button onClick={() => updateAssessmentStatus(item?.assessment?.assessmentId, AssessmentStatusType.APPROVED)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600">Accept</button>
                            </div>
                          )
                        ) : status === "Quoted" ? (
                          showDropdown[item?.itemId] ? (
                            canChangeStatus(item?.status) && (
                              <div className="flex justify-end gap-2 pr-3">
                                <select className="p-1 text-xs border rounded" value={rejectReasons[item?.itemId] || ""} onChange={(e) => setRejectReasons({ ...rejectReasons, [item?.itemId]: Number(e.target.value), })} >
                                  <option value="">Select a reason</option>
                                  {rejectionOptions?.map((reason, idx) => (
                                    <option key={idx} value={reason?.id}> {reason?.value} </option>
                                  ))}
                                </select>
                                <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.REJECTED)} className="px-2 py-1 text-xs text-white bg-red-600 rounded" > Confirm Reject </button>
                                <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.ACCEPTED)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600" > Accept </button>
                              </div>
                            )
                          ) : (
                            canChangeStatus(item?.status) && (
                              <div className="flex justify-end gap-2 pr-3">
                                <button onClick={() => setShowDropdown({ ...showDropdown, [item?.itemId]: true, })} className="px-2 py-1 text-xs text-white bg-red-600 rounded" > Reject </button>
                                <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.ACCEPTED)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600" > Accept </button>
                              </div>
                            )
                          )
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="py-3 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">£{tradeDetail?.value?.grandTotal}</td>
                  {showAssessmentPrice && (
                    <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">£{tradeDetail?.value?.assessmentTotal}</td>
                  )}
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
                  {showActionColumn && (
                    <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
          {tradeDetail?.value?.street != "" && tradeDetail?.value?.street != null &&
            <div className={`p-4 text-left border rounded shadow-lg cursor-pointer bg-white mt-6`}>
              <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                <h2 className="w-full font-semibold text-gray-700 uppercase text-md">
                  Collection Address
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className='text-sm sm:col-span-5'>
                  {tradeDetail?.value?.street != "-" && <p>{tradeDetail?.value?.street}</p>}
                  {tradeDetail?.value?.street2 != "-" && <p>{tradeDetail?.value?.street2}</p>}
                  {tradeDetail?.value?.city != "-" && <p>{tradeDetail?.value?.city}</p>}
                  {tradeDetail?.value?.state != "-" && <p>{tradeDetail?.value?.state}</p>}
                  {tradeDetail?.value?.postCode != "-" && <p>{tradeDetail?.value?.postCode}</p>}
                  {tradeDetail?.value?.country != "-" && <p>{tradeDetail?.value?.country}</p>}
                </div>
              </div>
            </div>
          }
          <div className="flex flex-col justify-start w-full gap-4 mt-6 text-left">
            <p className="text-sm font-normal text-gray-600">If in the meantime you decide that you would rather a collections be organized please call us on <span className="font-semibold">01444 237070</span> or email us at  <a href="mailto:sales@parkcameras.com" className="text-sky-600">sales@parkcameras.com</a> and someone will be willing to help you change the shipping method.</p>
            <p className="text-sm font-normal text-gray-600">Before coming into store, why not check out our extensive range of <Link href={`/search`} passHref className="underline text-sky-500">camera gears</Link>.</p>
          </div>
        </div>
      }
    </>
  );
}
