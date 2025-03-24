import {
  TRADE_IN_GUEST_CHECKOUT,
  TRADE_IN_PRODUCTS,
} from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function getTradeInProducts(searchText: any, cookies: any) {
  async function getTradeInProductsAsync() {
    const url = new URL(TRADE_IN_PRODUCTS, TRADE_IN_BASE_URL)
    url.searchParams.set('searchtext', searchText)
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        method: 'GET',
        cookies,
      })
      return response?.value
    } catch (error: any) {
      logError(error)
    }
  }
  return getTradeInProductsAsync()
}
