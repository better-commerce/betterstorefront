import { TRADE_IN_GET_SHIPPING_METHODS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function getShippingMethods(cookies?: any) {
  async function getShippingMethodsAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: TRADE_IN_GET_SHIPPING_METHODS,
        method: 'GET',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
  return getShippingMethodsAsync()
}
