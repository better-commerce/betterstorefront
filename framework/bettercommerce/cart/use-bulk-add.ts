import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'
interface Props {
  basketId: string
  products: any
  cookies?: any
}

export default function useBulkAdd() {
  return async function handler({ basketId, products, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/items/add-bulk`,
        method: 'PUT',
        data: products,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log('error while throwing the response to NEXT api', error)
      throw new Error(error)
    }
  }
}
