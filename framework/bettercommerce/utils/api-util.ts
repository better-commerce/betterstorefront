import { v4 as uuid } from 'uuid'
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Cookie } from "./constants";
import { removeItem, setItem } from "@components/utils/localStorage";
import setSessionIdCookie, { getExpiry, getMinutesInDays } from "@components/utils/setSessionId";
import { SessionIdCookieKey } from "@components/utils/constants";

/**
 * Makes an API call to the given endpoint with the given config.
 * If the response is a redirect, the browser will be redirected to the new URL.
 * Otherwise, the response object will be returned.
 * @param config The AxiosRequestConfig object to use for the API call.
 * @returns The response object if the call was not a redirect, otherwise null.
 */
export const callApi = async (config: AxiosRequestConfig) => {
    const response: any = await axios(config)
    if (response?.data?.redirect) {
        removeItem('user')
        Cookies.remove(Cookie.Key.SITE_USER_ID)
        Cookies.remove(Cookie.Key.SITE_USER_HAS_MEMBERSHIP)
        setItem('wishListItems', [])
        setItem('cartItems', { lineItems: [] })
        Cookies.remove(Cookie.Key.USER_TOKEN)
        Cookies.remove(SessionIdCookieKey)
        Cookies.remove(Cookie.Key.COMPANY_ID)
        Cookies.remove(Cookie.Key.USER_TOKEN)
        const basketIdRef = uuid()
        Cookies.set(Cookie.Key.BASKET_ID, basketIdRef, {
          expires: getExpiry(getMinutesInDays(365)),
        })
        setSessionIdCookie()
        removeItem('isPaymentLink')
        Cookies.remove(Cookie.Key.IS_PAYMENT_LINK)
        window.location.href = response?.data?.redirect
        return null
    }
    return response
}