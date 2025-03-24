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
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${item.status == "QuoteAccepted" ? 'bg-emerald-200 border-emerald-500 text-emerald-500' :
                      item.status == "Assessment" ? 'bg-sky-200 border-sky-500 text-sky-500' :
                        item.status == "Quoted" ? 'bg-yellow-200 border-yellow-500 text-yellow-500' :
                          item.status == "QuoteRejected" ? 'bg-red-200 border-red-500 text-red-500' : 'bg-gray-200 border-gray-500 text-gray-500'
                      }`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-right border">£{item.grandTotal || '-'}</td>
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
