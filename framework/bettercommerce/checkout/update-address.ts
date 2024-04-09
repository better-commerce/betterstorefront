import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  basketId?: string
  model: any
  isCNC?: boolean
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({ basketId, model, isCNC = false, cookies }: Props) {
    let url = CHECKOUT_ENDPOINT + `/${basketId}/address`
    if (isCNC) {
      url = CHECKOUT_ENDPOINT + `/${basketId}/address-billing`
    }

    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        data: !isCNC ? model : model?.billingAddress,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
        logRequest: true,
      })
      return response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
