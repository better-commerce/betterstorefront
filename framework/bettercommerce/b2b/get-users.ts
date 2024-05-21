import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_USERS } from '@components/utils/constants'
import { Guid } from '@commerce/types'
interface Props {
    companyId: string
  }

export default function useB2BCompanyUsers() {
    return async function handler( companyId : Props) {
      if (!companyId) {
        return null
      }
      const url = `${B2B_COMPANY_USERS}${companyId}/users`
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