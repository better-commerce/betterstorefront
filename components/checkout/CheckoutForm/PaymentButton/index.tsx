// Base Imports
import React, { useEffect } from 'react'

// Component Imports
import { CODPaymentButton } from './CODPaymentButton'
import { PayPalPaymentButton } from './PayPalPaymentButton'
import { IDispatchState, IPaymentButtonProps } from './BasePaymentButton'
import { MasterCardPaymentButton } from './MasterCardPaymentButton'
import { CheckoutPaymentButton } from './CheckoutPaymentButton'
import { StripePaymentButton } from './StripePaymentButton'
import { KlarnaPaymentButton } from './KlarnaPaymentButton'
import { ClearPayPaymentButton } from './ClearPayPaymentButton'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import { PaymentGateway } from '@components/utils/payment-constants'

/**
 * Factory helper/renderer component for <PaymentButton>
 * @param props
 * @returns
 */
const PaymentButton = (props: IPaymentButtonProps & IDispatchState) => {
  const { paymentMethod } = props

  let Component: any
  if (matchStrings(paymentMethod?.systemName, PaymentGateway.PAYPAL, true)) {
    Component = PayPalPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentGateway.CHECKOUT, true)
  ) {
    Component = CheckoutPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentGateway.MASTER_CARD, true)
  ) {
    Component = MasterCardPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentGateway.STRIPE, true)
  ) {
    Component = StripePaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentGateway.KLARNA, true)
  ) {
    Component = KlarnaPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentGateway.CLEAR_PAY, true)
  ) {
    Component = ClearPayPaymentButton
  } else {
    Component = CODPaymentButton
  }

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  return <Component {...props} />
}

export default PaymentButton
