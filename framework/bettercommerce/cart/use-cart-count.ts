import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError, processCartData } from '@framework/utils/app-util'
interface Props {
  basketId?: string
  cookies?: any
}

export default function useAddItem() {
  return async function handler({ basketId, cookies }: Props) {
    const data = {
      basketId,
    }
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}`,
        method: 'get',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      const ItemCount = processCartData( { ...response.result })?.lineItems?.length
      return ItemCount
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
