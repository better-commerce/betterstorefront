import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  userId?: string
}

export default function useAssociateCart() {
  return async function handler({ basketId, userId }: Props) {
    const data = {
      id: basketId,
      userId,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/user/${userId}/update`,
        method: 'post',
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