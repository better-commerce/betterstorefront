import { TRADE_IN_LOGIN } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function postLogin(
  data: any,
  cookies?: any,
) {
  async function postLoginAsync() {
    //const url = new URL(TRADE_IN_GUEST_CHECKOUT, BC_API_BASE_URL)

    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: TRADE_IN_LOGIN,
        method: 'post',
        data,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }

  return postLoginAsync()
}
