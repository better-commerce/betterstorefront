import fetcher from '../fetcher'
import { B2B_COMPANY_USERS } from '@components/utils/constants'
interface Props {
    companyId: string
  }

export default function useB2BCompanyUsers() {
    return async function handler( companyId : Props) {
      const url = `${B2B_COMPANY_USERS}${companyId}/users`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'get',
        })
        return response
      } catch (error: any) {
        console.log(error, 'error')
        // throw new Error(error.message)
      }
    }
  }