import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_DETAILS, B2B_QUOTE_NOTE, EmptyObject } from '@components/utils/constants'

export default function sendNotes() {
  return async function handler(data: any, cookies: any = EmptyObject) {
    const url = B2B_QUOTE_NOTE
    try {
      const response: any = await fetcher({
        url: url,
        method: 'put',
        data,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
