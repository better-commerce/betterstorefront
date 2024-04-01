// Package Imports
import Cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'

// Other Imports
import { decrypt, encrypt } from './cipher'
import fetcher from '@framework/fetcher'
import setSessionIdCookie, {
  getExpiry,
  getMinutesInDays,
} from '@components/utils/setSessionId'
import {
  EmptyString,
  INFRA_LOG_ENDPOINT,
  PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS,
  NEXT_PINCODE_LOOKUP,
  BETTERCOMMERCE_DEFAULT_CURRENCY,
  BETTERCOMMERCE_CURRENCY,
  EmptyObject,
} from '@components/utils/constants'
import { stringToBoolean, tryParseJson, matchStrings } from './parse-util'
import { ILogRequestParams } from '@framework/api/operations/log-payment'
import { LocalStorage } from '@components/utils/payment-constants'
import { setItem, getItem, removeItem } from '@components/utils/localStorage'
import { DataSubmit } from '@commerce/utils/use-data-submit'
import axios from 'axios'
import { Guid } from '@commerce/types'
import { Cookie } from './constants'
import { sumBy } from 'lodash'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'

export const isCartAssociated = (cartItems: any) => {
  if (cartItems?.userId && cartItems?.userId !== Guid.empty) {
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

export const maxBasketItemsCount = (config: any) => {
  const basketSettings = config?.configSettings?.find(
    (x: any) => x.configType === 'BasketSettings'
  )

  if (basketSettings?.configKeys?.length) {
    const maxBasketItems =
      basketSettings?.configKeys?.find(
        (x: any) => x.key === 'BasketSettings.MaximumBasketItems'
      )?.value || '0'

    return parseInt(maxBasketItems)
  }

  return 0
}

export const validateAddToCart = (
  productId: string,
  cartItems: any,
  maxBasketItemsCount: number
) => {
  if (cartItems?.lineItems && cartItems?.lineItems?.length) {
    const findLineItem = cartItems?.lineItems?.find((x: any) =>
      matchStrings(x?.productId, productId, true)
    )
    if (findLineItem) {
      return findLineItem?.qty != maxBasketItemsCount
    }
  }
  return true
}

export const sanitizeBase64 = (base64: string) => {
  if (base64) {
    return base64
      ?.replace('data:image/png;base64,', EmptyString)
      ?.replace('data:image/jpeg;base64,', EmptyString)
  }
  return EmptyString
}

export const resetBasket = async (setBasketId: any, generateBasketId: any) => {
  Cookies.remove(Cookie.Key.SESSION_ID)
  setSessionIdCookie()
  Cookies.remove(Cookie.Key.BASKET_ID)
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

export const removePrecedingSlash = (value: string) => {
  if (value && value.indexOf('/') === 0) {
    return value.substring(1)
  }
  return value
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

export const vatIncluded = () => {
  return stringToBoolean((getItem('includeVAT') as string) || 'true')
}
const kitCartItems: any = (cartItems: any) => {
  const cartItemsExcludingKitItem = cartItems?.lineItems?.filter(
    (val: any) => val?.basketItemGroupId != ''
  )
  return sumBy(cartItemsExcludingKitItem, 'qty')
}

export const cartItemsValidateAddToCart = (
  cartItems: any,
  maxBasketItemsCount: number,
  quantity?: any
) => {
  let sumOfItemsQty = sumBy(cartItems?.lineItems, 'qty')
  const kitCartItemsQuant = kitCartItems(cartItems)
  sumOfItemsQty =
    sumOfItemsQty - (kitCartItemsQuant > 0 ? kitCartItemsQuant : 0)
  if (quantity) {
    sumOfItemsQty = JSON.parse(quantity) + sumOfItemsQty
    if (sumOfItemsQty > maxBasketItemsCount && maxBasketItemsCount !== 0) {
      return false
    } else if (maxBasketItemsCount === 0) {
      return true
    }
  } else {
    if (sumOfItemsQty >= maxBasketItemsCount && maxBasketItemsCount !== 0) {
      return false
    } else if (maxBasketItemsCount === 0) {
      return true
    }
  }
  return true
}
export const getCurrency = () => {
  const currencyCode =
    Cookies.get(Cookie.Key.CURRENCY) ||
    BETTERCOMMERCE_DEFAULT_CURRENCY! ||
    BETTERCOMMERCE_CURRENCY!
  return currencyCode
}

export const getCurrentCurrency = () => {
  const currencyCode =
    Cookies.get(Cookie.Key.CURRENT_CURRENCY) ||
    BETTERCOMMERCE_DEFAULT_CURRENCY! ||
    BETTERCOMMERCE_CURRENCY!
  return currencyCode
}

export const getCurrencySymbol = () => {
  const currencySymbol = Cookies.get(Cookie.Key.CURRENCY_SYMBOL)
  return currencySymbol
}

export const setCurrentCurrency = (value: string) => {
  Cookies.set(Cookie.Key.CURRENT_CURRENCY, value)
}

export const resetAlgoliaSearch = () => {
  const btnReset: any = document.querySelector('button.ais-SearchBox-reset')
  if (btnReset) {
    if (btnReset.click) {
      btnReset.click()
    } else if (btnReset.onClick) {
      btnReset.onClick()
    }
  }
}

export const getAlgoliaSearchPriceColumn = (isIncludeVAT: boolean) => {
  const currencyCode = getCurrency()

  switch (currencyCode.toUpperCase()) {
    case 'GBP':
      return isIncludeVAT ? 'price_uk' : 'priceex_uk'

    case 'EUR':
      return isIncludeVAT ? 'price_ie' : 'priceex_ie'

    case 'USD':
      return isIncludeVAT ? 'price_us' : 'priceex_us'
      break

    default:
      return isIncludeVAT ? 'price_uk' : 'priceex_uk'
  }
}

export const getAlgoliaSearchListPriceColumn = (isIncludeVAT: boolean) => {
  const currencyCode = getCurrency()

  switch (currencyCode.toUpperCase()) {
    case 'GBP':
      return isIncludeVAT ? 'listprice_uk' : 'listpriceex_uk'

    case 'EUR':
      return isIncludeVAT ? 'listprice_ie' : 'listpriceex_ie'

    case 'USD':
      return isIncludeVAT ? 'listprice_us' : 'listpriceex_us'
      break

    default:
      return isIncludeVAT ? 'listprice_uk' : 'listpriceex_uk'
  }
}

export const getCartValidateMessages = (messageCode: string, product: any) => {
  let message = EmptyString
  if (messageCode) {
    const messageCodes = tryParseJson(messageCode) as any[];
    if ( messageCodes?.length) {
      const priceChanged = messageCodes?.find((x: any) => x?.Key === product?.stockCode && matchStrings(x?.Value, "PriceChanged", true))
      const soldOut = messageCodes?.find((x: any) => x?.Key === product?.stockCode && matchStrings(x?.Value, "SoldOut", true))
      message = priceChanged ? "Price Changed" : soldOut ? "Sold Out" : EmptyString
    }
  }
  return message
}
export const getAlgoliaSearchCurrencyLabel = () => {
  const currencyCode = getCurrency()

  switch (currencyCode.toUpperCase()) {
    case 'GBP':
      return 'currency_uk'

    case 'EUR':
      return 'currency_ie'

    case 'USD':
      return 'currency_us'
      break

    default:
      return 'currency_uk'
  }
}

export const getElasticSearchPriceColumn = (isIncludeVAT: boolean) => {
  const currencyCode = getCurrency()

  switch (currencyCode.toUpperCase()) {
    case 'GBP':
      return isIncludeVAT ? 'price_uk' : 'price_uk'

    case 'EUR':
      return isIncludeVAT ? 'price_ie' : 'price_ie'

    case 'USD':
      return isIncludeVAT ? 'price_us' : 'price_us'
      break

    default:
      return isIncludeVAT ? 'price_uk' : 'price_uk'
  }
}

export const isB2BUser = (user: any): boolean => {
  return user?.companyId && user?.companyId !== Guid.empty
}

export const isIncludeVATInPriceDisplay = (
  isIncludeVAT: boolean,
  product: any
): boolean => {
  return (
    isIncludeVAT || (!isIncludeVAT && product?.price?.raw?.withoutTax === 0)
  )
}

export const logError = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('error', error)
  }
}

export const setPageScroll = (location: any, x = 0, y = 0) => {
  if (
    SCROLLABLE_LOCATIONS.find((x: string) => location.pathname.startsWith(x))
  ) {
    setItem(LocalStorage.Key.PAGE_SCROLL, { x, y })
  }
}

export const resetPageScroll = (x = 0, y = 0) => {
  setItem(LocalStorage.Key.PAGE_SCROLL, { x, y })
}

export const backToPageScrollLocation = (location: any) => {
  if (
    SCROLLABLE_LOCATIONS.find((x: string) => location.pathname.startsWith(x))
  ) {
    const scrollLocation: any = getItem(LocalStorage.Key.PAGE_SCROLL)
    window.scrollTo({
      top: scrollLocation?.y,
      behavior: 'smooth',
    })
  }
}

export const isEligibleForFreeShipping = (
  config: any,
  grandTotalWithTax: any
): boolean => {
  const ShippingSettings = config?.configSettings?.find(
    (x: any) => x.configType === 'ShippingSettings'
  )

  if (ShippingSettings?.configKeys?.length) {
    const FreeShippingOverXValue =
      ShippingSettings?.configKeys?.find(
        (x: any) => x.key === 'ShippingSettings.FreeShippingOverXValue'
      )?.value || '0'
    return grandTotalWithTax < FreeShippingOverXValue
  }
  return false
}

export const notFoundRedirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  }
}

export const saveUserToken = (userToken: any) => {
  if (userToken?.access_token) {
    Cookies.set(Cookie.Key.USER_TOKEN, encrypt(userToken?.access_token), {
      expires: getExpiry(getMinutesInDays(365)),
    })
  }
}

export const getBrowserSessionId = (originalDocument?: any) => {
  let sessionId = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : ""

  if (originalDocument) {
    sessionId = /SESS\w*ID=([^;]+)/i.test(originalDocument.cookie) ? RegExp.$1 : ""
  }
  return sessionId
}

export const getNavigationStack = (sessionId: string) => {
  const navigationStack: any = getItem(LocalStorage.Key.NAVIGATION_STACK) || EmptyObject
  if (sessionId && navigationStack[sessionId]) {
    const navStack = navigationStack[sessionId]
    return navStack || []
  }
  return new Array<any>()
}

export const canGoBack = () => {
  const sessionId = getBrowserSessionId()
  const navStack: any = getNavigationStack(sessionId)
  if (navStack?.length) {
    return (navStack?.length > 1)
  }
  return false
}

export const ensureNavigationStack = (url: string, origin: string) => {
  const sessionId = getBrowserSessionId()
  const navStack: Array<string> = getNavigationStack(sessionId)

  if (navStack?.length == 0 || (navStack?.length > 0 && new URL(navStack[navStack?.length - 1], origin).pathname.indexOf(url) === -1 /*!matchStrings(navStack[navStack?.length - 1], url, true)*/)) {
    navStack.push(url)
    setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
  }
}

export const pushSearchToNavigationStack = (url: string, searchTerm: string) => {
  const sessionId = getBrowserSessionId()
  const navStack = getNavigationStack(sessionId)
  if (navStack) {
    navStack.push(!url?.includes('?') ? `${url}?searchTerm=${encodeURIComponent(searchTerm)}` : `${url}&searchTerm=${encodeURIComponent(searchTerm)}`)
    setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
  }
  /*if (navStack?.length > 0 && matchStrings(navStack[navStack?.length - 1], url, true)) {
    navStack[navStack?.length - 1] = !url?.includes('?') ? `${url}?searchTerm=${encodeURIComponent(searchTerm)}` : `${url}&searchTerm=${encodeURIComponent(searchTerm)}`
    setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
  }*/
}

export const getNavigationStackSearchTerm = (window: any) => {
  const sessionId = getBrowserSessionId()
  const navStack = getNavigationStack(sessionId)
  if (navStack?.length) {
    const lastNav = navStack[navStack?.length - 1]
    const navUrl = new URL(window.location.pathname, window?.location?.origin)
    if (lastNav.indexOf(navUrl.pathname) !== -1) {
      const searchTermUrl = new URL(lastNav, window?.location?.origin)
      const searchParams = searchTermUrl.searchParams
      if (searchParams.size) {
        return searchParams.get('searchTerm') || EmptyString
      }
    }
  }
  return EmptyString
}

export const popNavigationStack = () => {
  const sessionId = getBrowserSessionId()
  const navStack = getNavigationStack(sessionId)
  if (navStack) {
    navStack.pop()
    setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
  }
}

export const pushNavigationStack = (url: string, window: any) => {
  const sessionId = getBrowserSessionId()
  const navStack = getNavigationStack(sessionId)
  if (navStack?.length === 0) {
    navStack.push(url)
  } else {
    const lastNav = navStack[navStack?.length - 1]
    const navUrl = new URL(url, window?.location?.origin)
    if (lastNav.indexOf(navUrl.pathname) === -1 && !matchStrings(lastNav, url, true)) {
      navStack.push(url)
      setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
    }
  }
  /*if ((navStack?.length === 0) || (navStack?.length > 0 && !matchStrings(navStack[navStack?.length - 1], url, true))) {
    navStack.push(url)
    setItem(LocalStorage.Key.NAVIGATION_STACK, { [`${sessionId}`]: navStack })
  }*/
}

export const getSocialLoginSettings = (pluginSettings: Array<any>): Array<any> => {
  const socialLoginSettings = pluginSettings?.filter((x: any) => {
    if (x?.categoryCode === 'SocialLogin') {
      const settings: any = tryParseJson(x?.settings)
      return settings?.IsEnabled
    }
    return false
  })
  return socialLoginSettings
}

export const getEnabledSocialLogins = (pluginSettings: Array<any>): string => {
  const socialLoginSettings = getSocialLoginSettings(pluginSettings)
  return socialLoginSettings?.map((x: any) => x?.name?.toLowerCase())?.join(',') || EmptyString
}