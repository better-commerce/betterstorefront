import {
  TRADE_IN_GET_ASSESSMENT_STATUS,
  TRADE_IN_GET_QUOTE_BY_ID,
} from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function amendProduct( id: string, cookies: any ) {
  async function amendProductAsync() {
    const url = new URL( `${TRADE_IN_GET_ASSESSMENT_STATUS}/${id}/amend`, BC_API_BASE_URL )

    try {
      const response = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: url.href,
        data: {}, // status is sent as a number
        method: 'PUT', // Changed from GET to PUT to properly send a JSON payload
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return amendProductAsync()
}
