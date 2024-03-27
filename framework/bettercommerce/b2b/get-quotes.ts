import fetcher from '../fetcher'
import { B2B_USER_QUOTES } from '@components//utils/constants'
interface Props {
    userId: string
  }

export default function useB2BCompanyUsers() {
    return async function handler( userId : Props) {
      const url = `${B2B_USER_QUOTES}${userId}/quotes`
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