import { TRADE_IN_GET_CUSTOMER } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function getCustomerDetails(cookies?: any) {
  async function getCustomerDetailsAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: TRADE_IN_GET_CUSTOMER,
        method: 'get',
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }

  return getCustomerDetailsAsync()
}
