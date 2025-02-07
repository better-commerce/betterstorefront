import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { B2B_COMPANY_DETAILS } from '@components/utils/constants'


export default function saveRFQ() {
    return async function handler(data: any, cookies: any) {
      const url = `${B2B_COMPANY_DETAILS}rfq`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'post',
          cookies,
          data,
        })
        return response
      } catch (error: any) {
        logError(error)
      }
    }
  }