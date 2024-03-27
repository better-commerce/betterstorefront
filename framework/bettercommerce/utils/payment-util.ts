// Package Imports
import axios from 'axios'

// Other Imports
import { decipherPayload } from './app-util'
import {
  PaymentMethodType,
  PaymentMethodTypeId,
} from '@better-commerce/bc-payments-sdk'
import {
  ENABLE_SECURED_PAYMENT_PAYLOAD,
  NEXT_CANCEL_ORDER,
  PAYMENTS_API,
} from '@components/utils/constants'
import { Payments } from '@components/utils/payment-constants'
import { matchStrings, tryParseJson } from './parse-util'
import { encrypt } from './cipher'
import {
  CLEARPAY_PAYMENT_ALLOWED_MAX_ORDER_VALUE,
  CLEARPAY_PAYMENT_ALLOWED_MIN_ORDER_VALUE,
} from './constants'

export const getReferer = (origin: string) => {
  let referer
  if (origin) {
    if (origin.startsWith('http://')) {
      referer = origin.replace('http://', '')
    } else if (origin.startsWith('https://')) {
      referer = origin.replace('https://', '')
    }

    referer = referer?.substring(0, referer?.indexOf('/'))
    referer = `${origin.startsWith('https://') ? 'https' : 'http'}://${referer}`
    if (referer.endsWith('/')) {
      referer = referer.substring(0, referer.length - 1)
    }
  }
  return referer
}
export const isClearPayPriceThresholdInvalid = function (value: number) {
  return !(
    value >= CLEARPAY_PAYMENT_ALLOWED_MIN_ORDER_VALUE &&
    value <= CLEARPAY_PAYMENT_ALLOWED_MAX_ORDER_VALUE
  )
}
export const cancelStorefrontOrder = async (orderId: string) => {
  const { data: orderResponse }: any = await axios.post(NEXT_CANCEL_ORDER, {
    id: orderId,
  })
  return orderResponse
}

export const getGatewayId = (gatewayName: string) => {
  if (matchStrings(gatewayName, PaymentMethodType.PAYPAL, true)) {
    return PaymentMethodTypeId.PAYPAL
  } else if (matchStrings(gatewayName, PaymentMethodType.CHECKOUT, true)) {
    return PaymentMethodTypeId.CHECKOUT
  } else if (matchStrings(gatewayName, PaymentMethodType.KLARNA, true)) {
    return PaymentMethodTypeId.KLARNA
  } else if (matchStrings(gatewayName, PaymentMethodType.CLEAR_PAY, true)) {
    return PaymentMethodTypeId.CLEAR_PAY
  } else if (matchStrings(gatewayName, PaymentMethodType.MASTER_CARD, true)) {
    return PaymentMethodTypeId.MASTER_CARD
  } else if (matchStrings(gatewayName, PaymentMethodType.JUSPAY, true)) {
    return PaymentMethodTypeId.JUSPAY
  } else if (matchStrings(gatewayName, PaymentMethodType.STRIPE, true)) {
    return PaymentMethodTypeId.STRIPE
  } else if (matchStrings(gatewayName, PaymentMethodType.COD, true)) {
    return PaymentMethodTypeId.COD
  } else if (
    matchStrings(gatewayName, PaymentMethodType.ACCOUNT_CREDIT, true)
  ) {
    return PaymentMethodTypeId.ACCOUNT_CREDIT
  } else if (matchStrings(gatewayName, PaymentMethodType.CHEQUE, true)) {
    return PaymentMethodTypeId.CHEQUE
  }
  return -1
}

export const getGatewayName = (id: number) => {
  if (id === PaymentMethodTypeId.PAYPAL) {
    return PaymentMethodType.PAYPAL
  } else if (id === PaymentMethodTypeId.CHECKOUT) {
    return PaymentMethodType.CHECKOUT
  } else if (id === PaymentMethodTypeId.KLARNA) {
    return PaymentMethodType.KLARNA
  } else if (id === PaymentMethodTypeId.CLEAR_PAY) {
    return PaymentMethodType.CLEAR_PAY
  } else if (id === PaymentMethodTypeId.MASTER_CARD) {
    return PaymentMethodType.MASTER_CARD
  } else if (id === PaymentMethodTypeId.JUSPAY) {
    return PaymentMethodType.JUSPAY
  } else if (id === PaymentMethodTypeId.STRIPE) {
    return PaymentMethodType.STRIPE
  } else if (id === PaymentMethodTypeId.COD) {
    return PaymentMethodType.COD
  } else if (id === PaymentMethodTypeId.ACCOUNT_CREDIT) {
    return PaymentMethodType.ACCOUNT_CREDIT
  } else if (id === PaymentMethodTypeId.CHEQUE) {
    return PaymentMethodType.CHEQUE
  }
  return -1
}

export const getB2BCompanyDetails = async (gatewayName: string, data: any) => {
  const gid = getGatewayId(gatewayName)
  const { data: b2bCompanyDetailsResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.B2B_COMPANY_DETAILS, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(b2bCompanyDetailsResult)
    : tryParseJson(b2bCompanyDetailsResult)
}

export const convertOrder = async (data: any) => {
  const {
    basketId,
    customerId,
    basket,
    billingAddress,
    shippingAddress,
    selectedShipping,
    selectedPayment,
    storeId,
    Payment,
  } = data
  const payload = {
    basketId,
    customerId,
    basket,
    billingAddress,
    shippingAddress,
    selectedShipping,
    selectedPayment,
    storeId,
    Payment,
  }
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(payload))
      : JSON.stringify(payload), // Data
    {
      params: { ...Payments.RequestParams.CONVERT_ORDER },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

/**
 * Specific to {ClearPay}, {Klarna} & {Stripe}, initiates a payment request.
 * @param gatewayName 
 * @param data 
 * @returns 
 */
export const initPayment = async (gatewayName: string, data: any) => {
  const gid = getGatewayId(gatewayName)
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.INIT_PAYMENT, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

/**
 * Specific to {Checkout} & {ClearPay}, requests a payment.
 * @param gatewayName 
 * @param data 
 * @returns 
 */
export const requestPayment = async (gatewayName: string, data: any) => {
  const gid = getGatewayId(gatewayName)
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.REQUEST_PAYMENT, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

/**
 * Specific to {Klarna}, creates a one time payment order.
 * @param gatewayName 
 * @param data 
 * @returns 
 */
export const createOneTimePaymentOrder = async (
  gatewayName: string,
  data: any
) => {
  const gid = getGatewayId(gatewayName)
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.CREATE_ONE_TIME_PAY_ORDER, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

/**
 * Specific to {ApplePay}, validates the payment session.
 * @param gatewayName 
 * @param data 
 * @returns 
 */
export const validatePaymentSession = async (
  gatewayName: string,
  data: any
) => {
  const gid = getGatewayId(gatewayName)
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.VALIDATE_PAYMENT_SESSION, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

export const requestToken = async (
  gatewayName: string,
  data: any
) => {
  const gid = getGatewayId(gatewayName)
  const { data: orderDetailResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.REQUEST_TOKEN, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(orderDetailResult)
    : tryParseJson(orderDetailResult)
}

export const processPaymentResponse = async (
  gatewayName: string,
  data: any
) => {
  const gid = getGatewayId(gatewayName)
  const { data: paymentResponseResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.PROCESS_PAYMENT_RESPONSE, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(paymentResponseResult)
    : tryParseJson(paymentResponseResult)
}

export const processPaymentWebHook = async (
  gatewayName: string,
  data: any
) => {
  const gid = getGatewayId(gatewayName)
  const { data: paymentResponseResult } = await axios.post(
    PAYMENTS_API, // Endpoint url
    ENABLE_SECURED_PAYMENT_PAYLOAD
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data), // Data
    {
      params: { ...Payments.RequestParams.PROCESS_PAYMENT_WEBHOOK, gid },
    }
  ) // Params
  return ENABLE_SECURED_PAYMENT_PAYLOAD
    ? decipherPayload(paymentResponseResult)
    : tryParseJson(paymentResponseResult)
}