import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  products: any
}

export default function useBulkAdd() {
  return async function handler({ basketId, products }: Props) {
    const data = {
      products,
    }
    const params = new URLSearchParams()
    products.forEach((product: any, index: number) => {
      params.append(`${index}`, product)
    })
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/bulkAdd`,
        method: 'post',
        data: params,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
