import { REGISTER_CUSTOMER } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  data: object
  cookies?: any
}

export default function useCreateCustomer() {
  return async function handler({ data, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${REGISTER_CUSTOMER}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      logError(error)
      throw new Error(error.message)
    }
  }
}
