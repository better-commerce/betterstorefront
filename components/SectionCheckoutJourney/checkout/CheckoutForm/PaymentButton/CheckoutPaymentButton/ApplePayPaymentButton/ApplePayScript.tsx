// Base Imports
import React, { useEffect } from 'react'

// Package Imports
import Script from 'next/script'

// Other Imports
import { Payments } from '@components/utils/payment-constants'
import { IApplePaymentProps } from '../../BasePaymentButton'

declare const ApplePaySession: any

const ApplePayScript = (props: IApplePaymentProps) => {
  const { onApplePayScriptLoaded } = props
  const window: any = global.window

  const canMakePaymentsWithActiveCard = (): boolean => {
    const canMakePayments =
      process.env.NODE_ENV === 'production'
        ? window?.ApplePaySession?.canMakePaymentsWithActiveCard(
          Payments.APPLE_PAY_MERCHANT_ID
        )
        : true
    return window?.ApplePaySession !== undefined && canMakePayments
  }

  const onScriptReady = () => {
    if (canMakePaymentsWithActiveCard() && onApplePayScriptLoaded) {
      onApplePayScriptLoaded(true)
    }
  }

  useEffect(() => {

    // Destructor (Component Unloaded)
    return () => {
      if (onApplePayScriptLoaded) {
        onApplePayScriptLoaded(false)
      }
    }

  }, [])

  return (
    <>
      <Script
        src={Payments.APPLE_PAY_SCRIPT_SRC_V1}
        strategy="lazyOnload"
        onReady={() => onScriptReady()}
      />
    </>
  )
}

export default ApplePayScript
