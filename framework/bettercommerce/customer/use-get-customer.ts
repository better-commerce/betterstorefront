import { CUSTOMER_BASE_API } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
  userId: string
  cookies: any
}

export default function useGetCustomer() {
  return async function handler({ userId, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}/${userId}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
