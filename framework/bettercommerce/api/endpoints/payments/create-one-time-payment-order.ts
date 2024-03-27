// Package Imports
import { v4 as uuid } from 'uuid'

// Other Imports
import { logPaymentRequest } from '@framework/utils/app-util'
import { LOG_REQUEST_OPTIONS } from '@components//utils/payment-constants'
import {
  BCEnvironment,
  PaymentOperation,
} from '@better-commerce/bc-payments-sdk'
import { AUTH_URL, BASE_URL, CLIENT_ID, SHARED_SECRET, } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components//utils/constants'

const logId = 'Payments | OneTimePaymentOrder'

const oneTimePaymentOrderApiMiddleware = function () {

  /**
   * ________
   * CHECKOUT
   * ‾‾‾‾‾‾‾‾
   * <Not Required>
   * 
   * ________
   * CLEARPAY
   * ‾‾‾‾‾‾‾‾
   * <Not Required>
   * 
   * ______
   * KLARNA
   * ‾‾‾‾‾‾
   * Creates a one time payment order.
   * API Reference - https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/step-3-create-an-order/create-a-one-time-payment-order/
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
   * ________
   * ApplePay
   * ‾‾‾‾‾‾‾‾
   * <Not Required>
   * @returns 
   */
  return async function useOneTimePaymentOrder({
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
      const oneTimePaymentResult =
        await new PaymentOperation().createOneTimePaymentOrder(data)

      logData = {}
      logData['response'] = oneTimePaymentResult
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

      return oneTimePaymentResult
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

      console.log(error)
      return { hasError: true, error: error?.response?.data }
    }
  }
}

export default oneTimePaymentOrderApiMiddleware
