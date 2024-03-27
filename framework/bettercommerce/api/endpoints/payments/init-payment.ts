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

const logId = 'Payments | InitPayment'

const initPaymentApiMiddleware = function () {

  /**
   * ________
   * CHECKOUT
   * ‾‾‾‾‾‾‾‾
   * <Not Required>
   * 
   * ________
   * CLEARPAY
   * ‾‾‾‾‾‾‾‾
   * Initiate a payment. This endpoint creates a checkout that is used to initiate the Clearpay payment process. Clearpay  uses the information in the order request to assist with the consumer’s pre-approval process.
   * API Reference - https://developers.clearpay.co.uk/clearpay-online/reference/create-checkout
   * 
   * ______
   * KLARNA
   * ‾‾‾‾‾‾
   * Initiate a payment. 
   * API Reference - https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/step-1-initiate-a-payment/
   * 
   * ______
   * PAYPAL
   * ‾‾‾‾‾‾
   * <Not Required>
   * 
   * ______
   * STRIPE
   * ‾‾‾‾‾‾
   * Create a PaymentIntent. Creates a PaymentIntent object.
   * API Reference - https://api-reference.checkout.com/#operation/requestAPaymentOrPayout
   * 
   * ________
   * ApplePay
   * ‾‾‾‾‾‾‾‾
   * <Not Required>
   * 
   * @returns 
   */
  return async function useInitPayment({ data, config, cookies, extras }: any) {
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
      const initPaymentResult = await new PaymentOperation().initPaymentIntent(
        data
      )

      logData = {}
      logData['response'] = initPaymentResult
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

      return initPaymentResult
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

export default initPaymentApiMiddleware
