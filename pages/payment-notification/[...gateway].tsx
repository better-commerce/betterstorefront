// Base Imports
import React from 'react'

// Package Imports
import { GetServerSideProps } from 'next'

// Component Imports
import Spinner from '@components//ui/Spinner'
import PaymentGatewayNotification from '@components//SectionCheckoutJourney/checkout-old/PaymentGatewayNotification'

// Other Imports
import { getItem } from '@components//utils/localStorage'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components//utils/constants'
import {
  PaymentMethodType,
  PaymentMethodTypeId,
} from '@better-commerce/bc-payments-sdk'
import { IGatewayPageProps } from 'framework/contracts/payment/IGatewayPageProps'
import { LocalStorage } from '@components//utils/payment-constants'
import { CARD_PAYMENT_3DS_ENABLED } from '@components//SectionCheckoutJourney/checkout-old/CheckoutForm/PaymentButton/CheckoutPaymentButton'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const GatewayPage = (props: IGatewayPageProps) => {
  const { gateway, isCancelled } = props
  let { params } = props

  if (gateway === PaymentMethodType.CHECKOUT && CARD_PAYMENT_3DS_ENABLED) {
    let payerId = params?.payerId
    let orderId = params?.orderId

    const orderResponse: any = getItem(LocalStorage.Key.ORDER_RESPONSE)
    if (orderResponse?.p?.t === PaymentMethodTypeId.CHECKOUT) {
      orderId = orderResponse?.p?.i
      payerId = orderResponse?.p?.c
    }

    params = {
      token: EmptyString,
      orderId: orderId,
      payerId: payerId,
    }
  }

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
  const { locale } = context
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
      let payerId = ''
      let orderId = ''

      if (!CARD_PAYMENT_3DS_ENABLED) {
        payerId = !isCancelled
          ? params?.PayerID || params?.payerID || params?.payerId
          : ''
        orderId = !isCancelled ? params?.orderId : ''
      }

      propParams = {
        token: EmptyString,
        orderId: orderId,
        payerId: payerId,
      }
      break

    case PaymentMethodType.PAYPAL:
      propParams = {
        token: params?.token, // For Paypal
        orderId: !isCancelled ? params?.orderId : '', // For Paypal
        payerId: !isCancelled
          ? params?.PayerID || params?.payerID || params?.payerId
          : '', // For Paypal
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
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      gateway: gateway, // Generic
      isCancelled: isCancelled, // Generic
      params: propParams, // Values depend on payment gateway provider
    }, // will be passed to the page component as props
  }
}

export default GatewayPage
