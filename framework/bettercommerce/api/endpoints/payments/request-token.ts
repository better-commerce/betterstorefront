// Package Imports
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
import { matchStrings } from '@framework/utils/parse-util'

const logId = 'Payments | RequestToken'

const RequestTokenApiMiddleware = function () {

    /**
     * ________
     * CHECKOUT
     * ‾‾‾‾‾‾‾‾
     * Exchange card details for a reference token that can be used later to request a card payment. Tokens are single use and expire after 15 minutes.
     * API Reference - https://api-reference.checkout.com/previous/#operation/requestAToken
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
     * <Not Required>
     * @returns 
     */
    return async function useRequestToken({
        data,
        config,
        cookies,
        extras,
    }: any) {
        let logData: any = {}
        let objectId = uuid()
        try {
            const publicKey = config?.settings?.find((x: any) => matchStrings(x?.key, 'AccountCode', true))?.value || EmptyString
            logData['request'] = { ...data, publicKey }
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

            const validatePaymentResult = await new PaymentOperation().requestToken({ ...data, publicKey })

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

export default RequestTokenApiMiddleware
