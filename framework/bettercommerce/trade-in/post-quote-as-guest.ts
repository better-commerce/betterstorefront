import { TRADE_IN_GUEST_CHECKOUT } from '@components/utils/constants'
import logRequest from '@framework/api/operations/log-payment'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function postQuoteAsGuest(
  data: any,
  cookies?: any,
) {
  async function postQuoteAsGuestAsync() {
    //const url = new URL(TRADE_IN_GUEST_CHECKOUT, TRADE_IN_BASE_URL)

    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: TRADE_IN_GUEST_CHECKOUT,
        method: 'post',
        data,
        cookies,
        logRequest: true,
      })
      return response.value
    } catch (error: any) {
      logError(error)
    }
  }

  return postQuoteAsGuestAsync()
}
