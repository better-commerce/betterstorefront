import { TRADE_IN_GET_ASSESSMENT_STATUS, } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function updateProductStockcode( id: string, stockcode: string, cookies: any ) {
  async function updateProductStockcodeAsync() {
    const url = new URL( `${TRADE_IN_GET_ASSESSMENT_STATUS}/${id}/parent-stockcode`, TRADE_IN_BASE_URL )

    try {
      const response = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        data: { parentStockCode: stockcode }, // status is sent as a number
        method: 'PUT', // Changed from GET to POST to properly send a JSON payload
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return updateProductStockcodeAsync()
}
