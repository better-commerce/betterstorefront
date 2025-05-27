import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function postQuoteAsUser(data: any, cookies?: any) {
  async function postQuoteAsUserAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: TRADE_IN_GET_QUOTE_BY_ID,
        method: 'post',
        data,
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response.value
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }

  return postQuoteAsUserAsync()
}
