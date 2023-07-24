// Base Imports
import React from 'react'

// Package Imports
import { GetServerSideProps } from 'next'

// Component Imports
import Spinner from '@components/ui/Spinner'
import PaymentGatewayNotification from '@components/checkout/PaymentGatewayNotification'

// Other Imports
import { EmptyString } from '@components/utils/constants'
import { PaymentMethodType } from '@components/utils/payment-constants'
import { IGatewayPageProps } from 'framework/contracts/payment/IGatewayPageProps'

const GatewayPage = (props: IGatewayPageProps) => {
  const { gateway, params, isCancelled } = props

  return (
    <>
      <Spinner />
      <PaymentGatewayNotification
        gateway={gateway}
        params={params}
        isCancelled={isCancelled}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let propParams: any
  const params: any = context?.query
  const gateway = params?.gateway?.length ? params?.gateway[0] : ''
  const isCancelled =
    params?.gateway?.length > 1
      ? params?.gateway[1] === 'canceled'
        ? true
        : false
      : false

  switch (gateway) {
    case PaymentMethodType.CHECKOUT:
    case PaymentMethodType.PAYPAL:
      const payerId = !isCancelled
        ? params?.PayerID || params?.payerID || params?.payerId
        : ''

      propParams = {
        token: params?.token, // For Paypal
        orderId: !isCancelled ? params?.orderId : '', // For Paypal & Checkout
        payerId: payerId, // For Paypal & Checkout
      }
      break

    case PaymentMethodType.STRIPE:
      propParams = {
        token: params?.payment_intent_client_secret, // For Stripe
        orderId: !isCancelled ? params?.payment_intent : EmptyString, // For Stripe
        payerId: EmptyString,
      }
      break

    case PaymentMethodType.KLARNA:
      propParams = {
        token: EmptyString, // For Klarna
        orderId: !isCancelled ? params?.orderId : EmptyString, // For Klarna
        payerId: EmptyString,
      }
      break

    case PaymentMethodType.CLEAR_PAY:
      propParams = {
        token: params?.token,
        orderId: !isCancelled ? params?.orderId : EmptyString,
        payerId: EmptyString,
      }
      break
  }

  return {
    props: {
      gateway: gateway, // Generic
      isCancelled: isCancelled, // Generic
      params: propParams, // Values depend on payment gateway provider
    }, // will be passed to the page component as props
  }
}

export default GatewayPage
