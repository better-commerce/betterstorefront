import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  basketId?: string
  model?: any
}

export default function updateShippingMethod() {
  return async function handler({ basketId, model }: Props) {
    const url = CHECKOUT_ENDPOINT + `/${basketId}/convert`
    try {
      const response: any = await fetcher({
        url,
        method: 'post',
        data: model,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response
    } catch (error: any) {
      console.log(error, 'err')
      // throw new Error(error.message)
    }
  }
}
