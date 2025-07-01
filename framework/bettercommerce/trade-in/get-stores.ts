import { TRADE_IN_GET_QUOTE_BY_ID, TRADE_IN_GET_SHIPPING_METHODS, TRADE_IN_GET_STORES } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'
export default function getStores(cookies?: any) {
  async function getStoresAsync() {
    const url = new URL(`${TRADE_IN_GET_STORES}`, BC_API_BASE_URL)
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: url.href,
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
  return getStoresAsync()
}
