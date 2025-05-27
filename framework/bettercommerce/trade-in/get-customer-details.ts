import { TRADE_IN_GET_CUSTOMER } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function getCustomerDetails(cookies?: any) {
  async function getCustomerDetailsAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: TRADE_IN_GET_CUSTOMER,
        method: 'get',
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }

  return getCustomerDetailsAsync()
}
