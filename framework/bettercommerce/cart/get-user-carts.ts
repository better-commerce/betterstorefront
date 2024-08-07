import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
  userId?: string
  cookies?: any
}

export default function getUserCart() {
  return async function handler({ userId, cookies }: Props) {
    const data = {
      userId,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/user/${userId}/all`,
        method: 'get',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      //url changed according to api20 get all baskets api
      return response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
