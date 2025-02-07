import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { B2B_COMPANY_DETAILS, EmptyObject } from '@components/utils/constants'

export default function getAllRFQ() {
  return async function handler(data: any, cookies: any = EmptyObject) {
    const url = `${B2B_COMPANY_DETAILS}rfq/search?currentPage=${data?.currentPage}&pageSize=${data?.pageSize}`
    try {
      const response: any = await fetcher({
        url: url,
        method: 'post',
        data,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
