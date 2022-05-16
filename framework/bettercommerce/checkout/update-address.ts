import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '@framework/fetcher'

interface Props {
  basketId?: string
  model: any
}

export default function updateShippingMethod() {
  return async function handler({ basketId, model }: Props) {
    const url = CHECKOUT_ENDPOINT + `/${basketId}/address`
    try {
      console.log(JSON.stringify({
        url,
        method: 'put',
        data: model,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      }))
      const response: any = await fetcher({
        url,
        method: 'put',
        data: model,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      console.log(response.result);
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
