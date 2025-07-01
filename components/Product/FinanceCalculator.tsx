import { NEXT_LOAN_CALCULATOR_GET_PRODUCT_RATES } from "@components/utils/constants";
import { callApi } from "@framework/utils/api-util";
import { AxiosRequestConfig } from "axios";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { useCallback, useEffect } from "react";

const DEPOSIT_AMOUNT_OPTIONS = [{ text: '10%', value: 10 }, { text: '20%', value: 20 }, { text: '30%', value: 30 }, { text: '40%', value: 40 }, { text: '50%', value: 50 }, ];

export default function FinanceCalculator({ loanCalculatorOpen }: { loanCalculatorOpen: boolean }) {

    const reCalcLoan = useCallback((ev: any) => {
    }, [])

    useEffect(() => {
        if (loanCalculatorOpen) {
            
        }
    }, [loanCalculatorOpen])

    useEffect(() => {
        const asyncHandler = async () => {
            const config: AxiosRequestConfig = { url: NEXT_LOAN_CALCULATOR_GET_PRODUCT_RATES, method: RequestMethod.GET, }
            const productRateResult = await callApi(config)
            console.log('productRateResult: ', productRateResult)
        }

        asyncHandler()
    }, [])

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-3">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
            FINANCE AVAILABLE SEE OPTIONS
            </h2>
        </div>
        
        {/* Content */}
        <div className="px-4 py-3">
            <p className="text-gray-700 text-sm mb-4">
            Pay <span className="font-bold">£206.85</span> a month for <span className="font-bold">6 months</span>. 
            Deposit <span className="font-bold">10%</span>, <span className="font-bold">0% APR</span>.
            </p>
            
            {/* Deposit Input */}
            <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Amount of Deposit (%)
            </label>
            <div className="relative">
                <select className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={reCalcLoan}>
                {DEPOSIT_AMOUNT_OPTIONS.map((option: any) => (
                <option key={option.value} value={option.value}>{option.value}</option> 
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </div>
            </div>
            </div>

            <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Loan Product
            </label>
            <div className="relative">
                <select className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={reCalcLoan}>
                {DEPOSIT_AMOUNT_OPTIONS.map((option: any) => (
                <option key={option.value} value={option.value}>{option.value}</option> 
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </div>
            </div>
            </div>
            
            {/* Installments Input */}
            <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Number of Installments
            </label>
            <div className="relative">
                <select className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={reCalcLoan}>
                <option>12</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </div>
            </div>
            </div>
            
            {/* Calculation Results */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Deposit to be paid today:</span>
                <span className="text-gray-900 font-medium">£137.90</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total cost of credit:</span>
                <span className="text-gray-900 font-medium">£0.00</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                <span className="text-gray-900 font-bold">Total repayable:</span>
                <span className="text-gray-900 font-bold">£1379.00</span>
            </div>
            </div>
        </div>
        </div>
    );
};
