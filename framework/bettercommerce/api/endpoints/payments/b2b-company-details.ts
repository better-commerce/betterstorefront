// Package Imports
import { v4 as uuid } from 'uuid'

// Other Imports
import { logPaymentRequest } from '@framework/utils/app-util'
import { LOG_REQUEST_OPTIONS } from '@components//utils/payment-constants'
import {
  BCEnvironment,
  BetterCommerceOperation,
} from '@better-commerce/bc-payments-sdk'
import { AUTH_URL, BASE_URL, CLIENT_ID, SHARED_SECRET, } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components//utils/constants'

const logId = 'B2BCompanyDetails'

const b2bCompanyDetailsApiMiddleware = function () {
  return async function useB2BCompanyDetails({
    data,
    config,
    cookies,
    extras,
  }: any) {
    let logData: any = {}
    let objectId = uuid()
    try {
      const params = {
        ...data,
        ...{ extras: { ...data.extras, ...{ cookies } } },
      }

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
        `${logId} Request`
      )

      BCEnvironment.init(CLIENT_ID!, SHARED_SECRET!, config, AUTH_URL, BASE_URL)
      BCEnvironment.addExtras({
        country: BETTERCOMMERCE_DEFAULT_COUNTRY,
        currency: cookies?.Currency,
        language: BETTERCOMMERCE_DEFAULT_LANGUAGE,
      })
      const b2bCompanyDetailsResult =
        await new BetterCommerceOperation().getCompanyDetails(params)

      logData = {}
      logData['response'] = b2bCompanyDetailsResult
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
        `${logId} Response`
      )

      return b2bCompanyDetailsResult
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
        `${logId} Error`
      )

      //console.log(error);
      return { hasError: true, error: error?.response?.data }
    }
  }
}

export default b2bCompanyDetailsApiMiddleware
