import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_DETAILS, EmptyObject } from '@components/utils/constants'

export default function useCompanyDetails() {
    return async function handler(userId: any , cookies = EmptyObject) {
      const url = `${B2B_COMPANY_DETAILS}${userId}/company`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'get',
          cookies
        })
        return response
      } catch (error: any) {
        logError(error)
        // throw new Error(error.message)
      }
    }
  }