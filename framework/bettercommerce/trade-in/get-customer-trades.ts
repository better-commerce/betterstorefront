import { TRADE_IN_GET_QUOTES } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function getCustomerTrades(cookies?: any) {
  async function getCustomerTradesAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: TRADE_IN_GET_QUOTES,
        method: 'get',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
        logRequest: (process.env.NODE_ENV === 'development'),
      })
      return response.value
    } catch (error: any) {
      logError(error)
    }
  }

  return getCustomerTradesAsync()
}
