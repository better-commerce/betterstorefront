// Package Imports
import Cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'

// Other Imports
import { decrypt, encrypt } from './cipher'
import fetcher from '@framework/fetcher'
import setSessionIdCookie from '@components/utils/setSessionId'
import {
  EmptyGuid,
  EmptyString,
  INFRA_LOG_ENDPOINT,
  PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS,
  NEXT_PINCODE_LOOKUP,
} from '@components/utils/constants'
import { stringToBoolean, tryParseJson, matchStrings } from './parse-util'
import { ILogRequestParams } from '@framework/api/operations/log-request'
import { LocalStorage } from '@components/utils/payment-constants'
import { setItem, getItem, removeItem } from '@components/utils/localStorage'
import { DataSubmit } from '@commerce/utils/use-data-submit'
import axios from 'axios'

export const isCartAssociated = (cartItems: any) => {
  if (cartItems?.userId && cartItems?.userId !== EmptyGuid) {
    return true
  }
  return false
}
export const getCurrentPage = () => {
  if (typeof window !== 'undefined') {
    let currentPage = window.location.href
    if (currentPage.includes('/products')) {
      currentPage = 'PDP'
    } else if (currentPage.includes('/collection')) {
      currentPage = 'PLP'
    } else if (currentPage.includes('/my-account')) {
      currentPage = 'My Account'
    } else {
      currentPage = 'Home'
    }
    return currentPage
  }

  return undefined
}

export const obfuscateHostName = (hostname: string) => {
  if (hostname?.length > 3) {
    return `gandalf${hostname.substring(hostname.length - 3)}`
  }
  return ''
}

export const validateAddToCart = (productId: string, cartItems: any) => {
  if (cartItems?.lineItems && cartItems?.lineItems?.length) {
      const findLineItem = cartItems?.lineItems?.find((x: any) => matchStrings(x?.productId, productId, true));
      if (findLineItem) {
          return (findLineItem?.qty != 5);
      }
  }
  return true;
};

export const sanitizeBase64 = (base64: string) => {
  if (base64) {
    return base64
      ?.replace('data:image/png;base64,', EmptyString)
      ?.replace('data:image/jpeg;base64,', EmptyString)
  }
  return EmptyString
}

export const resetBasket = async (setBasketId: any, generateBasketId: any) => {
  Cookies.remove('sessionId')
  setSessionIdCookie()
  Cookies.remove('basketId')
  const generatedBasketId = generateBasketId()
  if (setBasketId) {
    setBasketId(generatedBasketId)
  }
}

export const parsePaymentMethodConfig = (
  configSettings: any,
  isSecured: boolean
) => {
  if (configSettings?.length) {
    const sandboxUrl =
      configSettings?.find((x: any) => x?.key === 'TestUrl')?.value ||
      EmptyString

    let accountCode =
      configSettings?.find((x: any) => x?.key === 'AccountCode')?.value ||
      EmptyString
    if (isSecured && accountCode) {
      accountCode = decrypt(accountCode)
    }

    let signature =
      configSettings?.find((x: any) => x?.key === 'Signature')?.value ||
      EmptyString
    if (isSecured && signature) {
      signature = decrypt(signature)
    }

    const liveUrl =
      configSettings?.find((x: any) => x?.key === 'ProductionUrl')?.value ||
      EmptyString
    const useSandbox = configSettings?.find(
      (x: any) => x?.key === 'UseSandbox'
    )?.value
    const cancelUrl =
      configSettings?.find((x: any) => x?.key === 'CancelUrl')?.value ||
      EmptyString
    const config = {
      useSandbox: configSettings?.find((x: any) => x?.key === 'UseSandbox')
        ?.value,
      accountCode: accountCode,
      signature: signature,
      baseUrl: stringToBoolean(useSandbox) ? sandboxUrl : liveUrl,
      cancelUrl: cancelUrl,
    }
    return config
  }

  return null
}

export const getOrderId = (order: any) => {
  return `${order?.orderNo}-${order?.id}`
}

export const getOrderInfo = () => {
  const orderPayment: any = getItem(LocalStorage.Key.ORDER_PAYMENT) || {}
  const orderResponse: any = getItem(LocalStorage.Key.ORDER_RESPONSE) || {}
  return { order: orderPayment, orderResponse: orderResponse }
}

export const logPaymentRequest = async (
  {
    headers = {},
    data = {},
    cookies = {},
    pageUrl,
    objectId = '',
    paymentGatewayId = 0,
    userId = '',
    userName = '',
  }: any,
  message: string
) => {
  const logData: ILogRequestParams = {
    ipAddress: EmptyString,
    logLevelId: 20,
    objectId: objectId ?? uuid(),
    pageUrl: pageUrl,
    requestData: JSON.stringify(data),
    shortMessage: message,
    fullMessage: JSON.stringify(headers),
    additionalinfo1: JSON.stringify(cookies),
    paymentGatewayId: paymentGatewayId,
    userId: userId,
    userName: userName,
  }

  const url = `${INFRA_LOG_ENDPOINT}/payment-log`
  try {
    const logResult: any = await fetcher({
      url,
      data: logData,
      method: 'POST',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
    })
    return logResult
  } catch (error: any) {
    console.log(error, 'err')
    // throw new Error(error.message)
  }
  return null
}

export const logActivityRequest = async (
  {
    headers = {},
    data = {},
    cookies = {},
    pageUrl,
    objectId = '',
    userId = '',
    userName = '',
  }: any,
  message: string
) => {
  const logData: ILogRequestParams = {
    ipAddress: EmptyString,
    logLevelId: 20,
    objectId: objectId ?? uuid(),
    pageUrl: pageUrl,
    requestData: JSON.stringify(data),
    shortMessage: message,
    fullMessage: JSON.stringify(headers),
    additionalinfo1: JSON.stringify(cookies),
    userId: userId,
    userName: userName,
  }

  const url = `${INFRA_LOG_ENDPOINT}/create`
  try {
    const logResult: any = await fetcher({
      url,
      data: logData,
      method: 'POST',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
    })
    return logResult
  } catch (error: any) {
    console.log(error, 'err')
    // throw new Error(error.message)
  }
  return null
}

export const decipherPayload = (result: string) => {
  if (result) {
    const deciphered = decrypt(result)
    if (deciphered) {
      const objParsed = tryParseJson(deciphered)
      return objParsed
    }
  }
  return null
}

export const parsePaymentMethods = (paymentMethods: any, isEncrypt = true) => {
  const UI_HIDDEN_SETTINGS_FIELDS =
    PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS?.length
      ? PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS.split(',')
      : []
  return paymentMethods?.map((x: any) => ({
    ...x,
    ...{
      notificationUrl: isEncrypt
        ? encrypt(x?.notificationUrl || EmptyString)
        : decrypt(x?.notificationUrl || EmptyString),
    },
    ...{
      settings: x?.settings?.map((setting: any) => {
        if (UI_HIDDEN_SETTINGS_FIELDS.includes(setting?.key)) {
          return {
            ...setting,
            ...{
              value: setting?.value
                ? isEncrypt
                  ? encrypt(setting?.value)
                  : decrypt(setting?.value)
                : null,
            },
          }
        }
        return setting
      }),
    },
  }))
}

export const countDecimals = (value: number) => {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0
  {
    return value.toString().split('.')[1].length || 0
  }
}

export const sanitizeAmount = (value: number) => {
  let amount = 0
  if (value) {
    const decimals = countDecimals(value)
    if (decimals > 2) {
      amount = Number.parseFloat(value.toFixed(2)) * 100
    } else {
      if (decimals == 0) {
        amount = value * 100
      } else {
        amount = parseInt((value * 100).toFixed(0))
      }
    }
  }
  return amount
}

export const findByFieldName = (fields: Array<any>, fieldName: string) => {
  if (fields?.length) {
    return fields?.find((x) => matchStrings(x?.name, fieldName, true))
  }
  return null
}
export const pincodeLookup = async (pincode: string) => {
  return null
  const { data: pinCodeLookupResult }: any = await axios.post(
    NEXT_PINCODE_LOOKUP,
    { postCode: pincode }
  )
  return pinCodeLookupResult?.result
}
export const submittingClassName = (
  state: any,
  type: number,
  id?: string | undefined
) => {
  return state &&
    state?.isSubmitting &&
    state?.submitSource === type &&
    (!state?.id || (state && state?.id && state?.id === (id ?? '')))
    ? 'opacity-50 cursor-not-allowed'
    : ''
}

export const submitData = (dispatch: any, type: number, id?: string) => {
  if (dispatch) {
    if (!id) {
      dispatch({ type: DataSubmit.SET_SUBMITTING, payload: type })
    } else {
      dispatch({
        type: DataSubmit.SET_SUBMITTING_OPTIONAL_ID,
        payload: { type: type, id: id ?? '' },
      })
    }
  }
}

export const parseFullName = (
  fullName: string
): { firstName: string | ' '; lastName: string | ' ' } => {
  if (fullName) {
    if (fullName.trim().indexOf(' ') == -1) {
      return {
        firstName: fullName,
        lastName: ' ',
      }
    } else {
      const index = fullName.indexOf(' ')
      const firstName = fullName.trim().substring(0, index).trim()
      const lastName = fullName
        .trim()
        .substring(index + 1)
        .trim()
      return { firstName: firstName, lastName: lastName ?? '' }
    }
  }
  return { firstName: ' ', lastName: ' ' }
}

export const resetSubmitData = (dispatch: any) => {
  if (dispatch) {
    dispatch({ type: DataSubmit.RESET_SUBMITTING })
  }
}

export const getMinMax = (list: Array<any>, dependantProp: string) => {
  let lowest = Number.POSITIVE_INFINITY
  let highest = Number.NEGATIVE_INFINITY
  var tmp
  for (var i = list.length - 1; i >= 0; i--) {
    tmp = list[i][dependantProp]
    if (tmp < lowest) lowest = tmp
    if (tmp > highest) highest = tmp
  }

  return {
    min: lowest,
    max: highest,
  }
}
