// Base Imports
import React, { useEffect } from 'react'

// Package Imports
import { PaymentMethodType } from '@better-commerce/bc-payments-sdk'

// Component Imports
import { CODPaymentButton } from './CODPaymentButton'
import { PayPalPaymentButton } from './PayPalPaymentButton'
import {
  IApplePaymentProps,
  IDispatchState,
  IPaymentButtonProps,
} from './BasePaymentButton'
import { MasterCardPaymentButton } from './MasterCardPaymentButton'
import { CheckoutPaymentButton } from './CheckoutPaymentButton'
import { StripePaymentButton } from './StripePaymentButton'
import { KlarnaPaymentButton } from './KlarnaPaymentButton'
import { ClearPayPaymentButton } from './ClearPayPaymentButton'
import AccountPaymentButton from './AccountPaymentButton'
import ChequePaymentButton from './ChequePaymentButton'
// import { ApplePayPaymentButton } from './ApplePayPaymentButton'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import { CheckoutStepType } from '@components/utils/constants'

/**
 * Factory helper/renderer component for <PaymentButton>
 * @param props
 * @returns
 */
const PaymentButton = (
  props: IPaymentButtonProps & IDispatchState & IApplePaymentProps
) => {
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
    matchStrings(
      paymentMethod?.systemName,
      PaymentMethodType.CHECKOUT_APPLE_PAY,
      true
    )
  ) {
    //Component = ApplePayPaymentButton
  } else if (
    matchStrings(paymentMethod?.systemName, PaymentMethodType.COD, true)
  ) {
    Component = CODPaymentButton
  } else {
    Component = <></>
  }

  return <Component {...props} />
}

export default PaymentButton
