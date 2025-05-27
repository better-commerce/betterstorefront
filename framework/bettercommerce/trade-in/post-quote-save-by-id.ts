import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'
export default function saveQuoteById(
  id: string,
  status: any,
  cookies?: any
) {
  async function saveQuoteByIdAsync() {
    const url = new URL(
      `${TRADE_IN_GET_QUOTE_BY_ID}/${id}/review-quote`,
      BC_API_BASE_URL
    )
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: url.href,
        data: { status: status },
        method: 'PUT',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return saveQuoteByIdAsync()
}
