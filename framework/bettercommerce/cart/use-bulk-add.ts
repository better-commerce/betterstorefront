import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'
import { logError } from '@framework/utils/app-util'
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
      return { ...response?.result, ...{ message: response?.message, messageCode: response?.messageCode } }
    } catch (error: any) {
      logError(error)
      //throw new Error(error)
    }
  }
}
