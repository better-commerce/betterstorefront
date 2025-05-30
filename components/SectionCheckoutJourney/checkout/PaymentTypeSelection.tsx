import { getPartialPayableAmount } from "@components/cart/CartSidebarView/CartSidebarView"
import { EmptyString } from "@components/utils/constants"
import { PaymentSelectionType } from "bc-payments-sdk"
import { useEffect, useState } from "react"

export enum SplitPaymentPrepaidValueType {
    PERCENTAGE = 'Percent',
    PRICE = 'Price',
}

interface PaymentTypeSelectionProps {
    paymentType: any
    setPaymentType: any
    partialAmount: number 
    payableAmount: number
    setPartialAmount: any
    basket: any
    dispatchState: any
}

const PAYMENT_TYPES = [
    { name: 'Full Payment', value: PaymentSelectionType.FULL, },
    { name: 'Partial Payment', value: PaymentSelectionType.PARTIAL, },
]

export default function PaymentTypeSelection(props: PaymentTypeSelectionProps) {
    const { paymentType, setPaymentType, partialAmount, payableAmount, setPartialAmount, basket, dispatchState } = props
    const [inputValue, setInputValue] = useState(partialAmount === 0 ? '0' : partialAmount.toString())

    // Sync input value when partialAmount changes externally
    useEffect(() => {
        setInputValue(partialAmount === 0 ? '0' : partialAmount.toString())
    }, [partialAmount])

    // Only allow digits, one dot, at most two decimals, and control keys
    const handlePartialKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | any) => {
        const { key, currentTarget, ctrlKey, metaKey, selectionStart } = e;

        // allow copy/paste, navigation, deletion, etc.
        if (ctrlKey || metaKey) return;
        if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(key))
            return;

        const value = currentTarget.value;
        const dotIndex = value.indexOf('.');

        // Only one decimal point
        if (key === '.' && dotIndex !== -1) {
            e.preventDefault();
            return;
        }

        // If typing a digit after the decimal, ensure no more than 2 decimals
        if (/^[0-9]$/.test(key) && dotIndex >= 0 && typeof selectionStart === 'number') {
            const decimalsCount = value.length - dotIndex - 1;
            // if cursor is to the right of the '.', and already 2 decimals, block
            if (selectionStart > dotIndex && decimalsCount >= 2) {
                e.preventDefault();
                return;
            }
        }

        // finally, only allow digits or dot
        if (!/[0-9.]/.test(key)) {
            e.preventDefault();
        }
    }

    // Handle input changes (paste, drag-drop, autocomplete, etc.)
    const handlePartialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // If user just types ".", turn it into "0."
        if (val === '.') {
            setInputValue('0.');
            setPartialAmount(0);
            return;
        }

        // Strip any minus sign (we don't allow negs)
        if (val.startsWith('-')) {
            val = val.slice(1);
        }

        // Only allow up to two decimal places
        // Acceptable patterns:
        //   ""               (empty)
        //   "123"            (integer)
        //   "123."           (with dot, no decimals yet)
        //   "123.4"          (one decimal)
        //   "123.45"         (two decimals)
        //   ".4"             (treated below as 0.4)
        const partialPattern = /^(?:[0-9]+(?:\.[0-9]{0,2})?|\.[0-9]{0,2})$/;

        if (val === '' || partialPattern.test(val)) {
            setInputValue(val);

            // update numeric value
            if (val === '' || val === '.') {
                setPartialAmount(0);
            } else {
                // leading "." → parseFloat handles it as 0.x
                setPartialAmount(parseFloat(val));
            }
        }
    }


    useEffect(() => {
        if (partialAmount === payableAmount) {
            setPaymentType(PaymentSelectionType.FULL)
        }
    }, [partialAmount, payableAmount])

    const partialPaymentAmount = getPartialPayableAmount(basket?.grandTotal?.raw?.withTax, basket?.paidAmount)
    return (
        <>
            {/* Payment Type Selection */}
            <div className="w-full space-y-2">
                {PAYMENT_TYPES.map((type: any) => (
                    <label key={type.value} className="flex items-center space-x-3">
                        <input type="radio" name="paymentType" value={type.value} checked={paymentType === type.value} onChange={(e: any) => {
                            dispatchState({ type: 'SET_ERROR', payload: EmptyString, })
                            setPaymentType(e.target.value)
                            if (e.target.value === PaymentSelectionType.FULL) {
                                setPartialAmount(0)
                                setInputValue('0')
                            }
                        }} className="form-radio h-5 w-5 text-sky-800 border-gray-300" />

                        <span className="text-gray-900 font-medium">{type.name}</span>
                        {type.name === PAYMENT_TYPES[0].name && (
                            <>
                                {basket?.isPartialPayment ? (
                                    <>{' - '}{`${basket?.currencySymbol}${partialPaymentAmount}`}</>
                                ) : (
                                    <>{' - '}{basket?.grandTotal?.formatted?.withTax}</>
                                )}
                            </>
                        )}
                    </label>
                ))}
                
                {/* Partial Payment Input */}
                {paymentType === PaymentSelectionType.PARTIAL && (
                    <div className="mt-3">
                        <input type="text" inputMode="decimal" placeholder="Enter partial amount" value={inputValue} onKeyDown={handlePartialKeyDown} onChange={handlePartialChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-sky-800 focus:border-sky-800 placeholder-gray-400" />
                    </div>
                )}
            </div>
        </>
    )
}