import Loader from "@components/Loader";
import { NEXT_TRADE_IN_PACKING_SLIP, TradeInItemCondition } from "@components/utils/constants";
import { generatePackingSlip, generatePDF } from "@components/utils/order";
import { callApi } from "@framework/utils/api-util";
import { logError } from "@framework/utils/app-util";
import { AxiosRequestConfig } from "axios";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { useEffect, useState } from "react";

export default function QuoteDetails({ data, quoteData, startNewTrade, deliveryData, deviceInfo }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadData, setDownloadData] = useState<any>(null);

  const { isMobile } = deviceInfo
  const getDownloadFile = async () => {
    setIsLoading(true);
    try {
      const config: AxiosRequestConfig = {
        url: NEXT_TRADE_IN_PACKING_SLIP,
        method: RequestMethod.POST,
        data: { id: deliveryData?.value },
      };
      const response = await callApi(config);

      generatePackingSlip(response?.data?.base64Pdf, quoteData?.value?.quoteNo);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex flex-col w-full gap-4 border-t border-gray-200'>
        <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
          <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">That's it, all the hard work is done!</h3>
          <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">Your Quote Reference Number: {quoteData?.value?.quoteNo} <span className="text-sm text-black">(Status: {quoteData?.value?.status})</span></h3>
          <p className='text-sm font-normal text-gray-600'>Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
          <p className='text-sm font-normal text-gray-600'>To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
          {deliveryData?.value && <div className="mt-4">
            <button
              onClick={getDownloadFile}
              className="px-4 py-2 text-white bg-[#2d4d9c] rounded hover:bg-[#1e3a7a] flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Packing Slip
            </button>
          </div>}
        </div>
        <div className='flex flex-col justify-start w-full mt-3 text-left'>
          <h3 className="text-xl font-semibold w-full text-[#2d4d9c] rounded disabled:bg-gray-300">Trade-in Summary</h3>
        </div>
      </div>
      <div className='flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded'>
        {isMobile ? (
          <>
            <table className='flex flex-col divide-y divide-gray-300'>
              <thead className="bg-gray-50">
                <tr className='flex w-full'>
                  <th className="py-3.5 pl-2 w-[60%] pr-3 text-left text-sm font-semibold text-gray-900">Trade in Product</th>
                  <th className="px-3 py-3.5 w-[40%] text-right text-sm font-semibold text-gray-900">Quote Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quoteData?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, itemIdx: number) => (
                  <tr key={`item-${itemIdx}`} className="flex w-full break-words bg-white hover:bg-gray-100">
                    <td className="flex gap-1 py-3 pl-2 w-[60%] pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                      <span className="w-10"><img src={item?.parentProductImageUrl} className='inline-block w-10 h-auto' alt={item?.parentProductName} /></span>
                      <div className='flex flex-col justify-center w-full gap-1 text-left'>
                        <span className="font-semibold text-left text-black whitespace-normal">
                          {item?.parentProductName}{" "}
                          <span className="text-xs font-medium text-black"> ({item?.parentStockCode}) </span>
                        </span>
                        <span className="text-xs text-left text-gray-600">
                          <strong>Condition: </strong>
                          {item?.condition == TradeInItemCondition.WELL_USED ? 'Well Used' :
                            item?.condition == TradeInItemCondition.GOOD ? 'Good' :
                              item?.condition == TradeInItemCondition.VERY_GOOD ? 'Very Good' :
                                item?.condition == TradeInItemCondition.EXCELLENT ? 'Excellent' :
                                  item?.condition == TradeInItemCondition.LIKE_NEW ? 'Like New' :
                                    item?.condition == TradeInItemCondition.FAULTY ? 'Faulty' :
                                      'N/A'
                          }
                        </span>
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
                        <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                      </div>
                    </td>
                    <td className="px-3 w-[40%] py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                      {"£"}{item?.price}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='flex w-full'>
                  <td className="py-4 pl-3 w-[60%] text-xl font-semibold text-left text-black whitespace-nowrap">Quote Total</td>
                  <td className="px-3 py-4 w-[40%] text-xl font-semibold text-right text-black whitespace-nowrap">
                    £{quoteData?.value?.grandTotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        ) : (
          <>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Trade in Product</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Quote Value</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quoteData?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, itemIdx: number) => (
                  <tr key={`item-${itemIdx}`} className="bg-white hover:bg-gray-100">
                    <td className="flex gap-5 py-3 pl-4 pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                      <img src={item?.parentProductImageUrl} className='inline-block w-auto h-16' alt={item?.parentProductName} />
                      <div className='flex flex-col justify-center w-full gap-1 text-left'>
                        <span className="font-semibold text-left text-black">
                          {item?.parentProductName}{" "}
                          <span className="text-xs font-medium text-black"> ({item?.parentStockCode}) </span>
                        </span>
                        <span className="text-xs text-left text-gray-600">
                          <strong>Condition: </strong>
                          {item?.condition == TradeInItemCondition.WELL_USED ? 'Well Used' :
                            item?.condition == TradeInItemCondition.GOOD ? 'Good' :
                              item?.condition == TradeInItemCondition.VERY_GOOD ? 'Very Good' :
                                item?.condition == TradeInItemCondition.EXCELLENT ? 'Excellent' :
                                  item?.condition == TradeInItemCondition.LIKE_NEW ? 'Like New' :
                                    item?.condition == TradeInItemCondition.FAULTY ? 'Faulty' :
                                      'N/A'
                          }
                        </span>
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
                    <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                      {"£"}{item?.price}
                    </td>
                    <td className={`whitespace-nowrap justify-end pr-2`} align="right">
                      <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-4 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Quote Total</td>
                  <td className="px-3 py-4 text-xl font-semibold text-right text-black whitespace-nowrap">
                    £{quoteData?.value?.grandTotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-1 lg:grid-cols-1">
        {data.slice(0, 1).map((store: any, index: number) => {
          return (
            <div key={index} className={`p-4 text-left border rounded shadow-lg cursor-pointer bg-white`}>
              <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                <h2 className="w-full text-xl font-semibold text-gray-700 uppercase">
                  DPD Home Collection Address
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className='col-span-12 sm:col-span-5'>
                  <h2 className="mt-2 mb-4 text-sm font-semibold text-gray-700 uppercase">Address:</h2>
                  {quoteData?.value?.street != "-" && <p>{quoteData?.value?.street}</p>}
                  {quoteData?.value?.street2 != "-" && <p>{quoteData?.value?.street2}</p>}
                  {quoteData?.value?.city != "-" && <p>{quoteData?.value?.city}</p>}
                  {quoteData?.value?.state != "-" && <p>{quoteData?.value?.state}</p>}
                  {quoteData?.value?.postCode != "-" && <p>{quoteData?.value?.postCode}</p>}
                  {quoteData?.value?.country != "-" && <p>{quoteData?.value?.country}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex flex-col justify-start w-full gap-4 text-left'>
        <p className='text-sm font-normal text-gray-600'>If in the meantime you decide that you would rather a collections be organized please call us on 01444 237070 or email us at sales@parkcameras.com and someone will be willing to help you change the shipping method.</p>
        <p className='text-sm font-normal text-gray-600'>Before coming into store, why not check out our extensive range of camera gear.</p>
      </div>
      <div className="flex flex-col mt-4">
        <button className="px-4 py-3 w-full border bg-[#2d4d9c] border-[#2d4d9c] text-white rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300"
          onClick={() => {
            startNewTrade();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}>Start New Trade</button>
      </div>
    </>
  )
}
