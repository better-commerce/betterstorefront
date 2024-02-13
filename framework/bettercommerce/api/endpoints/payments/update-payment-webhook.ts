// Package Imports
import { v4 as uuid } from 'uuid'

// Other Imports
import { logPaymentRequest } from '@framework/utils/app-util'
import { LOG_REQUEST_OPTIONS } from '@components/utils/payment-constants'
import { BCEnvironment, BetterCommerceOperation, getGatewayId, } from '@better-commerce/bc-payments-sdk'
import { AUTH_URL, BASE_URL, CLIENT_ID, SHARED_SECRET, } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString } from '@components/utils/constants'

const logId = 'Payments | UpdatePaymentWebHook'

const updatePaymentWebHookApiMiddleware = function () {
    return async function useUpdatePaymentWebHook({
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
                cookies,
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

            console.log('--- config ---', JSON.stringify(config))
            BCEnvironment.init(CLIENT_ID!, SHARED_SECRET!, config, AUTH_URL, BASE_URL)
            BCEnvironment.addExtras({
                country: BETTERCOMMERCE_DEFAULT_COUNTRY,
                currency: cookies?.Currency,
                language: BETTERCOMMERCE_DEFAULT_LANGUAGE,
            })
            //const paymentResponseResult = null
            console.log({
                paymentMethodTypeId: getGatewayId(config?.systemName),
                paymentMethodType: config?.systemName,
                data: params,
            })
            const paymentResponseResult = await new BetterCommerceOperation().processPaymentHook({
                paymentMethodTypeId: getGatewayId(config?.systemName),
                paymentMethodType: config?.systemName,
                data: { ...params, extras: { clientId: CLIENT_ID!, sharedSecret: SHARED_SECRET!, config, authUrl: AUTH_URL, baseUrl: BASE_URL } },
            })
            /*console.log(`await new BetterCommerceOperation().processPaymentHook({
                paymentMethodTypeId: ${getGatewayId(config?.systemName)},
                paymentMethodType: ${config?.systemName},
                data: ${JSON.stringify(params)},
              })`)*/

            logData = {}
            logData['response'] = paymentResponseResult
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

            return paymentResponseResult
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

export default updatePaymentWebHookApiMiddleware
