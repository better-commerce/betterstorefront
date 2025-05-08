import { TRADE_IN_GET_PACKING_SLIP, TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function getPackingSlip(id: string, cookies?: any) {
  async function getPackingSlipAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: `${TRADE_IN_GET_PACKING_SLIP}/${id}/packing-slip`,
        method: 'GET',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error
    }
  }
  return getPackingSlipAsync()
}
