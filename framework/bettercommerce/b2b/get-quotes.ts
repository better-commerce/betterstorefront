import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_USER_QUOTES, EmptyObject } from '@components/utils/constants'

export default function useB2BCompanyUsers() {
    return async function handler(userId: any, cookies = EmptyObject) {
      const url = `${B2B_USER_QUOTES}${userId}/quotes?currentPage=1&pageSize=1000`
      try {
        const response: any = await fetcher({
          url: url,
          method: 'get',
          cookies,
        })
        return response
      } catch (error: any) {
        logError(error)
        // throw new Error(error.message)
      }
    }
  }