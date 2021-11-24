import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  userId?: string
}

export default function getUserCart() {
  return async function handler({ userId }: Props) {
    const data = {
      userId,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${userId}/baskets`,
        method: 'get',
        data,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
