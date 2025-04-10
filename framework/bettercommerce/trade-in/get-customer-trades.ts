import { TRADE_IN_GET_QUOTES } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function getCustomerTrades(cookies?: any, params?:any) {
  async function getCustomerTradesAsync() {
    const url = new URL(`${TRADE_IN_GET_QUOTES}?page=${params?.page || 1}&pageSize=${params?.pageSize || 10}&sortBy=${params?.sortBy || 'created_on'}&sortDescending=${params?.sortDescending || true}`, TRADE_IN_BASE_URL)
    
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        method: 'GET',

        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response.value
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }

  return getCustomerTradesAsync()
}
