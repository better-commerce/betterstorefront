// Package Imports
import { v4 as uuid } from 'uuid'

// Other Imports
import { logError, logPaymentRequest } from '@framework/utils/app-util'
import { LOG_REQUEST_OPTIONS } from '@components//utils/payment-constants'
import {
  BCEnvironment,
  PaymentOperation,
} from '@better-commerce/bc-payments-sdk'
import { AUTH_URL, BASE_URL, CLIENT_ID, SHARED_SECRET, } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components//utils/constants'

const logId = 'Payments | RequestPayment'

const requestPaymentApiMiddleware = function () {

  /**
   * ________
   * CHECKOUT
   * ‾‾‾‾‾‾‾‾
   * Request a payment or payout. Sends a request for payment or payout.
   * API Reference - https://api-reference.checkout.com/#operation/requestAPaymentOrPayout
   * 
   * ________
   * CLEARPAY
   * ‾‾‾‾‾‾‾‾
   * Capture Full Payment. This endpoint performs a payment capture for the full value of the payment plan.
   * API Reference - https://developers.clearpay.co.uk/clearpay-online/reference/capture-full-payment
   * 
   * ______
   * KLARNA
   * ‾‾‾‾‾‾
   * <Not Required>
   * 
   * ______
   * PAYPAL
   * ‾‾‾‾‾‾
   * <Not Required>
   * 
   * ______
   * STRIPE
   * ‾‾‾‾‾‾
   * <Not Required>
   * 
   * _________________
   * Checkout ApplePay
   * ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
   * Request a payment or payout. Sends a request for payment or payout.
   * API Reference - https://www.checkout.com/docs/payments/add-payment-methods/apple-pay#Endpoints_2
   * 
   * @returns 
   */
  return async function useRequestPayment({
    data,
    config,
    cookies,
    extras,
  }: any) {
    let logData: any = {}
    let objectId = uuid()
    try {
      logData['request'] = data
      logData['requestId'] = objectId
      if (LOG_REQUEST_OPTIONS) {
        console.log(config)
        logData['requestOptions'] = config
      }
      await logPaymentRequest(
        {
          //headers: {},
          paymentGatewayId: config?.id || 0,
          data: logData,
          cookies,
          pageUrl: EmptyString,
          objectId,
        },
        `${config?.systemName} | ${logId} Request`
      )

      BCEnvironment.init(CLIENT_ID!, SHARED_SECRET!, config, AUTH_URL, BASE_URL)
      BCEnvironment.addExtras({
        country: BETTERCOMMERCE_DEFAULT_COUNTRY,
        currency: cookies?.Currency,
        language: BETTERCOMMERCE_DEFAULT_LANGUAGE,
      })
      const requestPaymentResult = await new PaymentOperation().requestPayment(
        data
      )

      logData = {}
      logData['response'] = requestPaymentResult
      logData['requestId'] = objectId
      await logPaymentRequest(
        {
          //headers: {},
          paymentGatewayId: config?.id || 0,
          data: logData,
          cookies,
          pageUrl: EmptyString,
          objectId,
        },
        `${config?.systemName} | ${logId} Response`
      )

      return requestPaymentResult
    } catch (error: any) {
      logData = {}
      logData['error'] = error
      logData['requestId'] = objectId
      await logPaymentRequest(
        {
          //headers: {},
          paymentGatewayId: config?.id || 0,
          data: logData,
          cookies,
          pageUrl: EmptyString,
          objectId,
        },
        `${config?.systemName} | ${logId} Error`
      )

      logError(error)
      return { hasError: true, error: error?.response?.data }
    }
  }
}

export default requestPaymentApiMiddleware
