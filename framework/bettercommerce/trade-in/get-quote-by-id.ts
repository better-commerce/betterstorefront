import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function getQuoteById(id: string, cookies?: any) {
  async function getQuoteByIdAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: `${TRADE_IN_GET_QUOTE_BY_ID}/${id}`,
        method: 'GET',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
logRequest: false,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
  return getQuoteByIdAsync()
}
