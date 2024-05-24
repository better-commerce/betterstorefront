import { CUSTOMER_BASE_API } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

export default function usePostContactUs() {
  return async function handler(body: any, cookies?: any) {
    const url = CUSTOMER_BASE_API + `contact-us`
    try {
      const response: any = await fetcher({
        url,
        method: 'post',
        data: body,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
