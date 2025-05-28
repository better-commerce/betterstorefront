import { PaymentSelectionType } from "bc-payments-sdk"
import { useEffect, useState } from "react"

interface PaymentTypeSelectionProps {
    paymentType: any
    setPaymentType: any
    partialAmount: number 
    payableAmount: number
    setPartialAmount: any
    basket: any
}

const PAYMENT_TYPES = [
    { name: 'Full Payment', value: PaymentSelectionType.FULL, },
    { name: 'Partial Payment', value: PaymentSelectionType.PARTIAL, },
]

export default function PaymentTypeSelection(props: PaymentTypeSelectionProps) {
    const { paymentType, setPaymentType, partialAmount, payableAmount, setPartialAmount, basket } = props

    useEffect(() => {
        if (partialAmount === payableAmount) {
            setPaymentType(PaymentSelectionType.FULL)
        }
    }, [partialAmount, payableAmount])
    return (
        <>
            {/* Payment Type Selection */}
            <div className="w-full space-y-2">
                {PAYMENT_TYPES.map((type: any) => (
                    <label key={type.value} className="flex items-center space-x-3">
                        <input type="radio" name="paymentType" value={type.value} checked={paymentType === type.value} onChange={(e: any) => setPaymentType(e.target.value)} className="form-radio h-5 w-5 text-sky-800 border-gray-300" />

                        <span className="text-gray-900 font-medium">{type.name}</span>
                        {type.name === PAYMENT_TYPES[0].name && (
                            <>
                                {basket?.isPartialPayment ? (
                                    <>{' '}{`(${basket?.currencySymbol}${basket?.grandTotal?.raw?.withTax - basket?.paidAmount})`}</>
                                ) : (
                                    <>{' '}{`(${basket?.grandTotal?.formatted?.withTax})`}</>
                                )}
                            </>
                        )}
                    </label>
                ))}
                
                {/* Partial Payment Input */}
                {paymentType === PaymentSelectionType.PARTIAL && (
                    <div className="mt-3">
                        <input type="number" placeholder="Enter partial amount" value={partialAmount} onChange={(e: any) => setPartialAmount(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-sky-800 focus:border-sky-800 placeholder-gray-400" min="0" step="0.01" />
                        {/*<p className="text-sm text-gray-500 mt-1">
                            Minimum partial payment: ${minimumPartialAmount}
                        </p>*/}
                    </div>
                )}
            </div>
        </>
    )
}