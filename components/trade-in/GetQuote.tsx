import axios, { AxiosRequestConfig } from 'axios';
import { useState } from "react";
import Loader from "@components/Loader";
import { NEXT_TRADE_IN_GET_QUOTE_BY_ID, NEXT_TRADE_IN_GET_SHIPPING_METHODS, NEXT_TRADE_IN_PRE_SIGN_AGREEMENT, NEXT_TRADE_IN_QUOTE_LINE_LEVEL_STATUS, QuoteItemStatusType, TradeInItemCondition } from "@components/utils/constants";
import Link from 'next/link';
import { logError } from '@framework/utils/app-util';
import { LoadingDots } from '@components/ui';
import { RequestMethod } from 'bc-payments-sdk/dist/constants';
import { callApi } from '@framework/utils/api-util';

export default function GetQuote({ quoteData, nextSteps, setShippingData, user, startNewTrade }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [getUpdatedQuoteDetails, setUpdatedQuoteDetails] = useState<any>(quoteData);
  const [rejectReasons, setRejectReasons] = useState<{ [key: string]: number }>({});
  const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>({});
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("")

  const rejectionOptions = [
    { id: 1, value: "Offer too low" },
    { id: 2, value: "Better offer elsewhere" },
    { id: 3, value: "Change of mind" },
    { id: 4, value: "Just getting an idea" }
  ];
  let updatedQuoteDetail = getUpdatedQuoteDetails
  const handleCheckboxChange = async (event: any) => {
    setIsChecked(event.target.checked);
  };
  const fetchShippingMethods = async () => {
    setIsLoading(true);
    try {
      if (isChecked) {
        const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_PRE_SIGN_AGREEMENT, method: RequestMethod.POST, data: { id: quoteData?.value?.id } };
        await callApi(config)
      }
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_GET_SHIPPING_METHODS, method: RequestMethod.POST };
      const shippingResult = await callApi(config)
      setShippingData(shippingResult?.data)
      nextSteps(getUpdatedQuoteDetails);
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedQuoteDetails = async (quoteId: string) => {
    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_GET_QUOTE_BY_ID, method: RequestMethod.POST, data: { id: quoteId } };
      const quoteResult = await callApi(config)
      setUpdatedQuoteDetails(quoteResult?.data)
    } catch (error) {
      logError(error)
    }
  };

  const handleItemAction = async (itemId: any, status: number) => {
    if (status === QuoteItemStatusType.REJECTED && !rejectReasons[itemId]) {
      setMessage("Please select reject reasons!!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }
    setIsLoading(true);
    try {
      if (getUpdatedQuoteDetails?.value?.id) {
        const requestBody = {
          id: getUpdatedQuoteDetails?.value?.id,
          itemId: itemId,
          status,
          rejectionReason: status === QuoteItemStatusType.ACCEPTED ? QuoteItemStatusType.SUBMITTED : rejectReasons[itemId],
        };

        const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_QUOTE_LINE_LEVEL_STATUS, method: RequestMethod.POST, data: requestBody };
        const quoteResult = await callApi(config)
        setUpdatedQuoteDetails(quoteResult?.data);
        await fetchUpdatedQuoteDetails(getUpdatedQuoteDetails?.value?.id);
      } else {
        logError("No quoteId received in response.")
      }
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all items are either approved or rejected
  const hasApprovedItem = updatedQuoteDetail?.value?.items?.some((item: any) => item?.status === "Accepted");
  const allItemsProcessed = updatedQuoteDetail?.value?.items?.every((item: any) => item?.status === "Accepted" || item?.status === "Rejected");
  const allItemsRejected = updatedQuoteDetail?.value?.items?.every((item: any) => item?.status === "Rejected");

  return (
    <>
      {!getUpdatedQuoteDetails || isLoading &&
        <Loader />
      }
      {message != "" && <div className='fixed z-10 top-24 right-4'>
        <span className='px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-full'>{message}</span>
      </div>}
      <div className="flex flex-col w-full gap-6 mt-4 sm:mt-5">
        <div className="flex flex-col justify-center w-full gap-4 mt-6 text-center sm:mt-8">
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
            Hi {user?.userId ? `${user?.firstName}` : updatedQuoteDetail?.value?.firstName}
          </h3>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
            Your Quote Reference Number: {updatedQuoteDetail?.value?.quoteNo}
          </h3>
        </div>
      </div>
      {updatedQuoteDetail?.value?.status != "AwaitingQuotation" ? (
        <>
          {updatedQuoteDetail?.value?.items?.length > 0 ?
            <>
              <div className={`${allItemsRejected ? 'ring-red-400' : 'ring-gray-300'} flex flex-col w-full overflow-hidden shadow ring-1  sm:rounded`}>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 w-6/12 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                      <th scope="col" className="px-3 py-3.5 w-2/12 text-right text-sm font-semibold text-gray-900">Price</th>
                      <th scope="col" className="px-3 py-3.5w-4/12 text-right text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {updatedQuoteDetail?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, itemIdx: number) => (
                      <tr key={`item-${itemIdx}`} className="bg-white hover:bg-gray-100">
                        <td className="flex gap-5 py-3 pl-4 pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                          <img src={item?.parentProductImageUrl} className="inline-block w-auto h-16" alt={item?.parentProductName} />
                          <div className="flex flex-col items-start justify-center w-full gap-1 text-left">
                            <span className="font-semibold text-left text-black">
                              {item?.parentProductName}{" "}
                              <span className="text-xs font-medium text-black"> ({item?.parentStockCode}) </span>
                            </span>
                            {item?.condition != "" &&
                              <span className="text-xs text-left text-gray-600">
                                <strong>Condition: </strong>
                                {item?.condition == TradeInItemCondition.WELL_USED ? 'Well Used' :
                                  item?.condition == TradeInItemCondition.GOOD ? 'Good' :
                                    item?.condition == TradeInItemCondition.VERY_GOOD ? 'Very Good' :
                                      item?.condition == TradeInItemCondition.EXCELLENT ? 'Excellent' :
                                        item?.condition == TradeInItemCondition.LIKE_NEW ? 'Like New' :
                                          'N/A'
                                }
                              </span>
                            }

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
                        </td>
                        <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">{"£"}{item?.price}</td>
                        {updatedQuoteDetail?.value?.status != "Quoted" && updatedQuoteDetail?.value?.status != "QuoteAccepted" && updatedQuoteDetail?.value?.status != "QuoteRejected" && updatedQuoteDetail?.value?.status != "QuoteExpired" ? (
                          <td>
                            <div className="flex justify-end pr-3">
                              <span className={`bg-yellow-100 border-yellow-400 text-yellow-600 px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{updatedQuoteDetail?.value?.status}</span>
                            </div>
                          </td>
                        ) : (
                          <td>
                            {item?.status === "Accepted" || item?.status === "Rejected" ? (
                              <div className="flex justify-end pr-3">
                                <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                              </div>
                            ) : (
                              showDropdown[item?.itemId] ? (
                                <div className="flex justify-end gap-2">
                                  <select className="p-1 text-xs border rounded" value={rejectReasons[item?.itemId] || ""} onChange={(e) => setRejectReasons({ ...rejectReasons, [item?.itemId]: Number(e.target.value) })} >
                                    <option value="">Select a reason</option>
                                    {rejectionOptions?.map((reason, idx) => (
                                      <option key={idx} value={reason?.id}>{reason?.value}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.REJECTED)} className="px-2 py-1 text-xs text-white bg-red-600 rounded">Confirm Reject</button>
                                  <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.ACCEPTED)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600" >Accept</button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2 pr-3">
                                  <button onClick={() => setShowDropdown({ ...showDropdown, [item?.itemId]: true })} className="px-2 py-1 text-xs text-white bg-red-600 rounded">Reject</button>
                                  <button onClick={() => handleItemAction(item?.itemId, QuoteItemStatusType.ACCEPTED)} className="px-2 py-1 text-xs text-white rounded bg-emerald-600">Accept</button>
                                </div>
                              )
                            )}
                          </td>
                        )}

                      </tr>
                    ))}
                  </tbody>
                  <tfoot className={`${allItemsRejected ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <tr>
                      <td className="py-3 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
                      <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">£{updatedQuoteDetail?.value?.grandTotal}</td>
                      <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Show Proceed Button only when all items are processed */}
              {allItemsProcessed && hasApprovedItem && (
                <div className="flex flex-col justify-center gap-4">
                  <div className='flex items-center justify-start gap-1'>
                    <input
                      type='checkbox'
                      name="pre-sign-agreement"
                      className='w-4 h-4 border border-gray-300 rounded'
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span className='text-sm italic font-normal text-gray-600'>
                      By checking this box, you approve the auto-acceptance of the quote if the price is greater than or equal to the quoted price.
                    </span>
                  </div>

                  <button
                    onClick={() => fetchShippingMethods()}
                    className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
                    Continue
                  </button>
                </div>
              )}
              {updatedQuoteDetail?.value?.status != "Quoted" && updatedQuoteDetail?.value?.status != "QuoteAccepted" && updatedQuoteDetail?.value?.status != "QuoteRejected" && updatedQuoteDetail?.value?.status != "QuoteExpired" &&
                <div className="flex flex-col mt-4">
                  <button className="px-4 py-3 w-full border bg-[#2d4d9c] border-[#2d4d9c] text-white rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300"
                    onClick={() => {
                      startNewTrade();
                      document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}>Start New Trade</button>
                </div>
              }
              {allItemsRejected &&
                (
                  <div className="flex flex-col mt-4">
                    <button className="px-4 py-3 w-full border bg-[#2d4d9c] border-[#2d4d9c] text-white rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300"
                      onClick={() => {
                        startNewTrade();
                        document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}>Start New Trade</button>
                  </div>
                )}
            </>
            : <div className='flex flex-col justify-center gap-3 py-5'>
              <span><LoadingDots /> Updating quote data...</span>
            </div>
          }
        </>
      ) : (
        <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
          <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">That's it, all the hard work is done!</h3>
          <p className='text-sm font-normal text-gray-600'>Thank you for submitting the details of your photographic kit. There are some items that we are going to have to get back to you for a trade-in price.</p>
          <p className='text-sm font-normal text-gray-600'>We aim to have these prices ready for you within 2 working days.</p>
          <p className='pt-6 text-sm font-normal text-gray-600'>In a meantime, why not take a look at our extensive range of <Link className='underline text-sky-600' href="/search" passHref>camera gear</Link> or <span className='underline cursor-pointer text-sky-600' onClick={() => {
            startNewTrade();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}>start an new trade</span>.</p>
        </div>
      )}
    </>
  );
}