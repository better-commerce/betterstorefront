import { TRADE_IN_PRODUCTS, } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function getTradeInProductByStockCode(stockcode: any, cookies: any) {
  async function getTradeInProductByStockcodeAsync() {
    const url = new URL(`${TRADE_IN_PRODUCTS}/stockcode?stockcode=${stockcode}`, BC_API_BASE_URL)
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: url.href,
        method: 'GET',
        cookies,
      })
      return response?.value
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return getTradeInProductByStockcodeAsync()
}
