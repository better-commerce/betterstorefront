// Package Imports
import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'

// Other Imports
import { logError, logPaymentRequest } from '@framework/utils/app-util'
import { LOG_REQUEST_OPTIONS } from '@components/utils/payment-constants'
import {
  BCEnvironment,
  PaymentOperation,
} from '@better-commerce/bc-payments-sdk'
import { AUTH_URL, BASE_URL, CLIENT_ID, SHARED_SECRET, } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components/utils/constants'

const logId = 'Payments | ValidatePaymentSession'

const validatePaymentSessionApiMiddleware = function () {

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
   * ________
   * ApplePay
   * ‾‾‾‾‾‾‾‾
   * Validates the payment session.
   * API Reference - https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation
   * @returns 
   */
  return async function useValidatePaymentSession({
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


      const pemCert = await fs.readFileSync(
        path.join(__dirname, '/certificates/ApplePayMerchant.pem')
      )
      const keyCert = await fs.readFileSync(
        path.join(__dirname, '/certificates/ApplePayMerchant.key')
      )

      BCEnvironment.init(CLIENT_ID!, SHARED_SECRET!, config, AUTH_URL, BASE_URL)
      BCEnvironment.addExtras({
        country: BETTERCOMMERCE_DEFAULT_COUNTRY,
        currency: cookies?.Currency,
        language: BETTERCOMMERCE_DEFAULT_LANGUAGE,
      })
      BCEnvironment.addExtras({
        pemCert,
        keyCert,
      })
      const validatePaymentResult =
        await new PaymentOperation().validatePaymentSession(data)

      logData = {}
      logData['response'] = validatePaymentResult
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

      return validatePaymentResult
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

export default validatePaymentSessionApiMiddleware
