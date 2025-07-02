import { NEXT_LOAN_CALCULATOR_GET_LOAN_DETAILS, NEXT_LOAN_CALCULATOR_GET_PRODUCT_RATES } from "@components/utils/constants";
import { NIL as emptyGuid } from "uuid";
import { callApi } from "@framework/utils/api-util";
import { AxiosRequestConfig } from "axios";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUI } from "@components/ui";
import { useTranslation } from "@commerce/utils/use-translation";

const DEPOSIT_AMOUNT_OPTIONS = [{ text: '10%', value: 10 }, { text: '20%', value: 20 }, { text: '30%', value: 30 }, { text: '40%', value: 40 }, { text: '50%', value: 50 }, ];

export default function FinanceCalculator({ product, loanCalculatorOpen }: { product: any, loanCalculatorOpen: boolean }) {
    const translate = useTranslation();
    const { setOverlayLoaderState, hideOverlayLoaderState } = useUI()
    const [productRates, setProductRates] = useState<Array<any>>([])
    const [numberOfInstallments, setNumberOfInstallments] = useState<number>(0)
    const [loanCalcParams, setLoanCalcParams] = useState<{ loanProductId: string, depositAmountPerc: number, numberOfInstallments: number }>({ loanProductId: "", depositAmountPerc: DEPOSIT_AMOUNT_OPTIONS[0]?.value, numberOfInstallments: 0 })
    const [loanDetails, setLoanDetails] = useState<any>({})

    const financeProductAvailable = useMemo(() => product?.customAttributes?.find((x: any) => x?.key === "other.financeproductavailable")?.value || "", [product])
    const reCalcFinance = useCallback((loanCalcParams: { loanProductId: string, depositAmountPerc: number, numberOfInstallments: number }) => {
        if (loanCalcParams?.loanProductId)
            setLoanCalcParams((prev) => ({ ...prev, loanProductId: loanCalcParams?.loanProductId }))

        if (loanCalcParams?.depositAmountPerc)
            setLoanCalcParams((prev) => ({ ...prev, depositAmountPerc: loanCalcParams?.depositAmountPerc }))

        if (loanCalcParams?.numberOfInstallments)
            setLoanCalcParams((prev) => ({ ...prev, numberOfInstallments: loanCalcParams?.numberOfInstallments }))
    }, [])

    const getLoanDetails = useCallback(async (params: { loanProductId: string, depositAmountPerc: number, numberOfInstallments: number }) => {
        const price = product?.price?.raw?.withTax
        const deposit = product?.price?.raw?.withTax * (params?.depositAmountPerc / 100)
        const config: AxiosRequestConfig = { url: NEXT_LOAN_CALCULATOR_GET_LOAN_DETAILS, method: RequestMethod.POST, data: { rateCardProductId: params?.loanProductId, deposit, price, } }
        const { data: calcResult } = await callApi(config)
        const [rateCard] = calcResult
        setLoanDetails(rateCard)
        return rateCard
    }, [])

    useEffect(() => {
        const asyncHandler = async () => {
            setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText'), })
            const interestFree = (financeProductAvailable?.toLowerCase().includes("interest free") || false)
            const config: AxiosRequestConfig = { url: NEXT_LOAN_CALCULATOR_GET_PRODUCT_RATES, method: RequestMethod.GET, params: { interestFree } }
            const { data: productRateResult } = await callApi(config)
            const sortedProductRates = productRateResult?.sort((a: any, b: any) => a.Term - b.Term)
            setProductRates(sortedProductRates)
            setNumberOfInstallments(sortedProductRates?.length ? sortedProductRates[0]?.Term : 0)
            setLoanCalcParams((prev) => ({ ...prev, numberOfInstallments: sortedProductRates?.length ? sortedProductRates[0]?.Term : 0 }))
            const rateCard = await getLoanDetails({ loanProductId: sortedProductRates[0]?.Id, depositAmountPerc: DEPOSIT_AMOUNT_OPTIONS[0]?.value, numberOfInstallments: sortedProductRates[0]?.Term })
            hideOverlayLoaderState()
        }

        asyncHandler()
    }, [product])

    useEffect(() => {
        const fetchLoanDetails = async () => {
            if (loanCalcParams?.loanProductId && loanCalcParams?.loanProductId !== emptyGuid) {
                setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText') });
                
                try {
                    const rateCard = await getLoanDetails(loanCalcParams);
                    // Update numberOfInstallments directly from the API response
                    setNumberOfInstallments(rateCard?.Term || 0);
                } finally {
                    hideOverlayLoaderState();
                }
            }
        }

        fetchLoanDetails();
    }, [loanCalcParams.loanProductId, loanCalcParams.depositAmountPerc]);

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
            {loanDetails && <p className="text-gray-700 text-sm mb-4">
                Pay <span className="font-bold">£{loanDetails?.MonthlyPayment}</span> a month for <span className="font-bold">{loanDetails?.Term} months</span>. 
                Deposit <span className="font-bold">{loanCalcParams?.depositAmountPerc}%</span>, <span className="font-bold">{loanDetails?.APR}% APR</span>.
            </p>}

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Loan Product
                </label>
                <div className="relative">
                    <select className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={(ev: any) => reCalcFinance({ loanProductId: ev?.target?.value, depositAmountPerc: 0, numberOfInstallments: 0 })}>
                        {productRates?.map((option: any) => (
                           <option key={option.Id} value={option.Id}>{option.FullName}</option> 
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </div>
                </div>
            </div>
            
            {/* Deposit Input */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Amount of Deposit (%)
                </label>
                <div className="relative">
                    <select className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={(ev: any) => reCalcFinance({ loanProductId: "", depositAmountPerc: parseFloat(ev?.target?.value), numberOfInstallments: 0 })}>
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
            {/*<div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Number of Installments
                </label>
                <div className="relative">
                    <select 
                        className="w-full py-2 pl-3 pr-8 border border-gray-300 rounded bg-white appearance-none text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={loanCalcParams.numberOfInstallments}
                        onChange={(ev) => reCalcFinance({ loanProductId: "", depositAmountPerc: 0, numberOfInstallments: parseInt(ev.target.value) })}
                    >
                        {numberOfInstallments > 0 && 
                            Array.from({ length: numberOfInstallments }, (_, i) => i + 1).map((option) => (
                                <option key={option} value={option} selected={option === numberOfInstallments}>
                                    {option}
                                </option>
                            ))
                        }
                    </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </div>
            </div>
            </div>*/}
            
            {/* Calculation Results */}
            {loanDetails && <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Deposit to be paid today:</span>
                    <span className="text-gray-900 font-medium">£{loanDetails?.Deposit?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total cost of credit:</span>
                    <span className="text-gray-900 font-medium">£{loanDetails?.TotalInterestPayable?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">Total repayable:</span>
                    <span className="text-gray-900 font-bold">£{loanDetails?.LoanValue?.toFixed(2)}</span>
                </div>
            </div>}
        </div>
        </div>
    );
};
