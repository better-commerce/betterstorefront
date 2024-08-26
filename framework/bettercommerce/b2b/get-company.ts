import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_DETAILS } from '@components/utils/constants'
interface Props {
    userId: string
  }

export default function useCompanyDetails() {
    return async function handler( userId : Props) {
      const url = `${B2B_COMPANY_DETAILS}${userId}/company`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'get',
        })
        return response
      } catch (error: any) {
        logError(error)
        // throw new Error(error.message)
      }
    }
  }