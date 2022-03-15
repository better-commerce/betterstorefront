import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  productId?: string
}

export default function useRemoveItem() {
  return async function handler({ basketId, productId }: Props) {
    const data = {
      basketId,
      productId,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/items/${productId}/remove`,
        method: 'delete',
        data,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
