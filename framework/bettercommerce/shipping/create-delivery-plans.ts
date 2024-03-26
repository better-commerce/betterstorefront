import { BASKET_ENDPOINT } from '@new-components/utils/constants'
import fetcher from '../fetcher'
import { RequestMethod } from '@better-commerce/bc-payments-sdk/dist/constants'
import { logError } from '@framework/utils/app-util'

interface Props {
  model: any
  cookies?: any
}

export default function createDeliveryPlans() {
  return async function handler({ model, cookies }: Props) {
    const { basketId } = model
    const url = `${BASKET_ENDPOINT}/${basketId}/deliveryplan`
    try {
      const response: any = await fetcher({
        url: url,
        method: RequestMethod.POST,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
