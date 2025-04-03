"use client"
import { WalletIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function WalletTable() {
  const [walletEnabled, setWalletEnabled] = useState(true);
  const walletBalance = 5000; // Mock wallet balance

  const transactions = [
    { date: "2025-04-01", type: "Credit", reference: "Refund", amount: 200 },
    { date: "2025-04-02", type: "Debit", reference: "Purchase", amount: 150 },
    { date: "2025-04-03", type: "Credit", reference: "Cashback", amount: 50 },
    { date: "2025-04-04", type: "Debit", reference: "Subscription", amount: 500 },
  ];
  return (
    <div className="w-full px-6">
      <h2 className="text-xl font-normal sm:text-2xl dark:text-black">My Wallet</h2>
      <div className="flex flex-col w-full gap-4 mt-6">
        <div className="flex flex-col w-full pb-4 mb-2 border-b border-gray-200">
          <label className="flex items-center flex-1 gap-4 cursor-pointer">
            <input type="checkbox" checked={walletEnabled} onChange={() => setWalletEnabled(!walletEnabled)} className="sr-only" />
            <span className="text-sm font-normal text-black">Enable Wallet</span>
            <div className={`relative w-[47px] h-[22px] transition-all ${walletEnabled ? "bg-emerald-500 border-emerald-800" : "bg-gray-300 border-gray-800"} rounded-full border`}>
              <div className={`absolute w-[20px] h-[20px] rounded-full shadow-md top-0 left-0 transform transition-all ${walletEnabled ? "translate-x-6 bg-white" : "bg-gray-800"}`}></div>
            </div>
          </label>
        </div>
        {walletEnabled ? (
          <div className="w-full mx-auto bg-white">
            <div className="p-4 mb-6 text-center bg-gray-100 rounded-lg">
              <h3 className="text-lg font-medium">Current Balance</h3>
              <p className="text-3xl font-bold text-sky-500">${walletBalance}</p>
            </div>
            <h3 className="mb-3 text-xl font-medium">Transaction History</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left border">Date</th>
                    <th className="p-2 text-left border">Type</th>
                    <th className="p-2 text-left border">Reference</th>
                    <th className="p-2 text-right border">Amount</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {transactions.map((txn, index) => (
                    <tr key={index} className="text-sm bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                      <td className="p-2 border">{txn.date}</td>
                      <td className="p-2 border">{txn.type}</td>
                      <td className="p-2 border">{txn.reference}</td>
                      <td
                        className={`border p-2 text-right font-semibold ${txn.type === "Credit" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {txn.type === "Debit" ? "-" : "+"}${txn.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center w-full py-10">
            <WalletIcon className="w-20 h-20 mx-auto text-gray-300" />
            <h4 className="text-xl font-semibold text-center text-gray-300">Wallet is disabled. Enable it to view balance and transactions.</h4>
          </div>
        )}
      </div>
    </div>
  );
}
