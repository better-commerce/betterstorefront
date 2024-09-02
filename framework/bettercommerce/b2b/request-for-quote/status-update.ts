import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { B2B_COMPANY_DETAILS } from '@components/utils/constants'

export default function statusUpdateRFQ() {
    return async function handler(id: any, data: any, cookies: any) {
      const url = `${B2B_COMPANY_DETAILS}/RFQ/${id}/status`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'patch',
          cookies,
          data,
        })
        return response
      } catch (error: any) {
        logError(error)
      }
    }
  }