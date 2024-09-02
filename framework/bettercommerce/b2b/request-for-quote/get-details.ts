import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { B2B_COMPANY_DETAILS } from '@components/utils/constants'

export default function getDetails() {
    return async function handler(id: any , cookies: any) {
      const url = `${B2B_COMPANY_DETAILS}rfq/${id}`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'get',
          cookies
        })
        return response
      } catch (error: any) {
        logError(error)
      }
    }
  }