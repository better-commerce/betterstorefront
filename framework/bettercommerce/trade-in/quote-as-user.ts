import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function postQuoteAsUser(data: any, cookies?: any) {
  async function postQuoteAsUserAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: TRADE_IN_GET_QUOTE_BY_ID,
        method: 'post',
        data,
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response.value
    } catch (error: any) {
      logError(error)
    }
  }

  return postQuoteAsUserAsync()
}
