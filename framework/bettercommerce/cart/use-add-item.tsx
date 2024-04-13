import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
  basketId?: string
  productId?: string
  qty?: number
  manualUnitPrice?: number
  displayOrder?: number
  stockCode?: string
  cookies?: any
}

export default function useAddItem() {
  return async function handler({
    basketId,
    productId,
    qty,
    manualUnitPrice,
    displayOrder,
    stockCode,
    cookies,
  }: Props) {
    const data = {
      basketId,
      productId,
      qty,
      //manualUnitPrice,
      displayOrder,
      stockCode,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/items/add`,
        method: 'put',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return { ...response.result, ...{ message: response.message } }
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
