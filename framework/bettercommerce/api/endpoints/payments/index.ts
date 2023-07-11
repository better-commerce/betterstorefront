// Package Imports
import store from 'store'

// Other Imports
import { BCPaymentEndpoint } from './constants'
import { encrypt } from '@framework/utils/cipher'
import { getPaymentMethods } from '@framework/payment'
import {
  BETTERCOMMERCE_COUNTRY,
  BETTERCOMMERCE_CURRENCY,
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  BETTERCOMMERCE_DEFAULT_CURRENCY,
} from '@components/utils/constants'
import { getGatewayName } from '@framework/utils/payment-util'
import useUpdatePaymentResponse from './update-payment-response'
import useRequestPayment from './request-payment'
import useInitPayment from './init-payment'
import useOneTimePaymentOrder from './create-one-time-payment-order'
import useConvertOrder from './convert-order'
import useB2BCompanyDetails from './b2b-company-details'

const PaymentsApiMiddleware = async function useBCPayments({
  data = {},
  params = {},
  headers,
  cookies,
  origin,
}: any) {
  const { t: type, s: isSecured, gid: gatewayId } = params
  let response = undefined
  let paymentConfig: any
  const b2bCompanyDetails = useB2BCompanyDetails()
  const convertOrder = useConvertOrder()
  const updatePaymentResponse = useUpdatePaymentResponse()
  const initPayment = useInitPayment()
  const requestPayment = useRequestPayment()
  const oneTimePaymentOrder = useOneTimePaymentOrder()

  try {
    if (gatewayId) {
      paymentConfig = await getPaymentConfig({
        paymentGateway: getGatewayName(gatewayId ? parseInt(gatewayId) : -1),
        cookies,
        origin,
        isSecured,
      })
    }

    switch (type) {
      // ------------------ B2B ------------------
      case BCPaymentEndpoint.B2B_COMPANY_DETAILS:
        response = await b2bCompanyDetails({
          data,
          config: paymentConfig,
          cookies,
        })
        break

      // ------------------ Checkout ------------------
      case BCPaymentEndpoint.CONVERT_ORDER:
        response = await convertOrder({ data, config: paymentConfig, cookies })
        break

      case BCPaymentEndpoint.PAYMENT_RESPONSE:
        if (paymentConfig) {
          response = await updatePaymentResponse({
            data,
            config: paymentConfig,
            cookies,
          })
        }
        break

      // ------------------ Payments ------------------
      case BCPaymentEndpoint.INIT_PAYMENT:
        if (paymentConfig) {
          response = await initPayment({ data, config: paymentConfig, cookies })
        }
        break

      case BCPaymentEndpoint.REQUEST_PAYMENT:
        if (paymentConfig) {
          response = await requestPayment({
            data,
            config: paymentConfig,
            cookies,
          })
        }
        break

      case BCPaymentEndpoint.CREATE_ONE_TIME_PAY_ORDER:
        if (paymentConfig) {
          response = await oneTimePaymentOrder({
            data,
            config: paymentConfig,
            cookies,
          })
        }
        break
    }
  } catch (error: any) {
    console.log(error)
    return { hasError: true, error: error?.message }
  }

  //if (response) {
  return isSecured
    ? encrypt(JSON.stringify(response))
    : JSON.stringify(response)
  //}
}

const getPaymentConfig = async ({
  paymentGateway,
  cookies,
  origin,
  isSecured,
}: any) => {
  const response: Array<any> = await getPaymentMethods()({
    countryCode:
      cookies?.Country ||
      store?.get('Country') ||
      BETTERCOMMERCE_COUNTRY ||
      BETTERCOMMERCE_DEFAULT_COUNTRY,
    currencyCode:
      cookies?.Currency ||
      store?.get('Currency') ||
      BETTERCOMMERCE_CURRENCY ||
      BETTERCOMMERCE_DEFAULT_CURRENCY,
    basketId: cookies?.basketId,
    secureFieldValuesExplicitlyDisabled: true,
  })
  const paymentConfig = response?.length
    ? response?.find(
        (x) => x?.systemName?.toLowerCase() === paymentGateway?.toLowerCase()
      )
    : undefined
  /*const paymentConfig = response?.length ? response?.find(x => matchStrings(x.systemName, PAYPAL_PAY_METHOD_SYSTEM_NAME || "", true)) : undefined;
    if (paymentConfig?.settings?.length) {
        const config = parsePaymentMethodConfig(paymentConfig?.settings, isSecured);
        const result = {
            ...config,
            ...{ returnUrl: `${origin}${isSecured ? decrypt(paymentConfig?.notificationUrl) : paymentConfig?.notificationUrl}` },
            ...{ cancelUrl: `${origin}/${config?.cancelUrl}` },
            ...{ paymentGatewayId: paymentConfig?.id },
        };
        return result;
    }*/
  return paymentConfig
}

export function bcPaymentsHandler() {
  return async function handler({
    data = {},
    params = {},
    cookies,
    origin,
  }: any) {
    return await PaymentsApiMiddleware({
      data,
      params,
      cookies,
      origin,
    })
  }
}

export default PaymentsApiMiddleware
