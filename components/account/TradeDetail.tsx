'use client';

import { NEXT_TRADE_IN_GET_QUOTE_BY_ID, TradeInItemCondition } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Loader from "@components/Loader";
export default function TradeInDetail() {
  const router: any = useRouter();
  const [tradeDetail, setTradeDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tradeinId = router.query?.tradeinId[0]
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

  return (
    <>
      {isLoading ? <Loader /> :
        <div className="w-full px-6">
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
              <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">That's it, all the hard work is done!</h3>
              <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">Your Quote Reference Number: {tradeDetail?.value?.quoteNo} <span className="text-sm text-black">(Status: {tradeDetail?.value?.status})</span></h3>
              <p className='text-sm font-normal text-gray-600'>Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
              <p className='text-sm font-normal text-gray-600'>To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
            </div>
            <div className='flex flex-col justify-start w-full mt-3 text-left'>
              <h3 className="text-xl font-semibold w-full text-[#2d4d9c] rounded disabled:bg-gray-300">Trade-in Summary</h3>
            </div>
          </div>
          <div className='flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className="bg-emerald-100">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
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
                    <td className={`whitespace-nowrap justify-end pr-2`} align="right">
                      <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="py-3 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">
                    £{tradeDetail?.value?.grandTotal}
                  </td>
                  <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className='flex flex-col justify-start w-full gap-4 text-left'>
            <p className='text-sm font-normal text-gray-600'>If in the meantime you decide that you would rather a collections be organized please call us on 01444 237070 or email us at sales@parkcameras.com and someone will be willing to help you change the shipping method.</p>
            <p className='text-sm font-normal text-gray-600'>Before coming into store, why not check out our extensive range of camera gear.</p>
          </div>
        </div>
      }
    </>
  );
}
