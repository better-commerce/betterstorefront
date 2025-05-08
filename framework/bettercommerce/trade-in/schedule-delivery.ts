import { TRADE_IN_GET_DELIVERY_ID, TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function getScheduleDeliveryById(quoteId: string, cookies?: any) {
  async function getScheduleDeliveryByIdAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: `${TRADE_IN_GET_DELIVERY_ID}/${quoteId}`,
        method: 'POST',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return getScheduleDeliveryByIdAsync()
}
