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
import AccountPaymentButton from './AccountPaymentButton'
import ChequePaymentButton from './ChequePaymentButton'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import { PaymentMethodType } from '@components/utils/payment-constants'

/**
 * Factory helper/renderer component for <PaymentButton>
 * @param props
 * @returns
 */
const PaymentButton = (props: IPaymentButtonProps & IDispatchState) => {
  const { paymentMethod } = props

  let Component: any
  if (matchStrings(paymentMethod?.systemName, PaymentMethodType.PAYPAL, true)) {
    Component = PayPalPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.CHECKOUT, true)
  ) {
    Component = CheckoutPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.MASTER_CARD, true)
  ) {
    Component = MasterCardPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.STRIPE, true)
  ) {
    Component = StripePaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.KLARNA, true)
  ) {
    Component = KlarnaPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.CLEAR_PAY, true)
  ) {
    Component = ClearPayPaymentButton
  } else if (
    matchStrings(
      paymentMethod?.systemName,
      PaymentMethodType.ACCOUNT_CREDIT,
      true
    )
  ) {
    Component = AccountPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.CHEQUE, true)
  ) {
    Component = ChequePaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.COD, true)
  ) {
    Component = CODPaymentButton
  } else {
    Component = <></>
  }

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  return <Component {...props} />
}

export default PaymentButton
