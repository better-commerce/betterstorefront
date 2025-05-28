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
    const [inputValue, setInputValue] = useState(partialAmount === 0 ? '0' : partialAmount.toString())

    // Sync input value when partialAmount changes externally
    useEffect(() => {
        setInputValue(partialAmount === 0 ? '0' : partialAmount.toString())
    }, [partialAmount])

    // Only allow digits, one dot, and control keys
    const handlePartialKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key, currentTarget } = e

        if (e.ctrlKey || e.metaKey) return               // allow copy/paste etc.
        if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(key)) return

        // Allow only one decimal point
        if (key === '.' && currentTarget.value.includes('.')) {
            e.preventDefault()
            return
        }

        // allow digits or one separator
        if (!/[0-9.]/.test(key)) {
            e.preventDefault()
        }
    }

    // Handle input changes
    const handlePartialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value

        // Handle leading decimal point
        if (val === '.') {
            setInputValue('0.')
            setPartialAmount(0)
            return
        }
        
        // Handle negative sign cases
        if (val.startsWith('-')) {
            val = val.substring(1)
        }

        // Allow only valid number patterns
        if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
            setInputValue(val)
            
            // Convert to number only if valid
            if (val === '' || val === '.') {
                setPartialAmount(0)
            } else {
                setPartialAmount(parseFloat(val))
            }
        }
    }

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
                        <input type="radio" name="paymentType" value={type.value} checked={paymentType === type.value} onChange={(e: any) => {
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
                                    <>{' - '}{`${basket?.currencySymbol}${basket?.grandTotal?.raw?.withTax - basket?.paidAmount}`}</>
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