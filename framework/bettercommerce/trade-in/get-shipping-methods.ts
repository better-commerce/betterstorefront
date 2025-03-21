import { TRADE_IN_GET_QUOTE_BY_ID, TRADE_IN_GET_SHIPPING_METHODS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function getShippingMethods(cookies?: any) {
  async function getShippingMethodsAsync() {
    const url = new URL(`${TRADE_IN_GET_SHIPPING_METHODS}`, TRADE_IN_BASE_URL)
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        method: 'GET',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
        logRequest:true,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
  return getShippingMethodsAsync()
}
