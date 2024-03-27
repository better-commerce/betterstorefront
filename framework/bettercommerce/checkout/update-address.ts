import { CHECKOUT_ENDPOINT } from '@components//utils/constants'
import fetcher from '../fetcher'

interface Props {
  basketId?: string
  model: any
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({ basketId, model, cookies }: Props) {
    const url = CHECKOUT_ENDPOINT + `/${basketId}/address`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        data: model,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
