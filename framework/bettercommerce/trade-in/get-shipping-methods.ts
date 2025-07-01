import { TRADE_IN_GET_SHIPPING_METHODS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'
export default function getShippingMethods(cookies?: any) {
  async function getShippingMethodsAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: TRADE_IN_GET_SHIPPING_METHODS,
        method: 'GET',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return getShippingMethodsAsync()
}
