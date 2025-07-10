import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  basketId?: string
  model: any
  isCNC?: boolean
  cookies?: any
}

export default function updateBasketAddress() {
  return async function handler({ basketId, model, isCNC = false, cookies }: Props) {
    let url = CHECKOUT_ENDPOINT + `/${basketId}/address`

    // Change By & Date: [GS, 10-Jul-2025]
    // Issue: Shipping address not getting updated in basket for CNC and delivery plans not getting generated.
    // Description: Previously, this API handler only updated the billing address for CNC. Added fix with minimal impact on the invoker payload of this API.
    let data = model

    if (isCNC && !model?.shippingAddress) {
        url = CHECKOUT_ENDPOINT + `/${basketId}/address-billing?sameAsShipping=false`
        data = model?.billingAddress
    }

    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        data,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
