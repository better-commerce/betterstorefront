import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
  orderId: string
  model: any
  cookies?: any
}

export default function putPaymentResponse() {
  return async function handler({ orderId, model, cookies }: Props) {
    try {
      //console.log(`${CHECKOUT_ENDPOINT}/${orderId}/payment-response`)
      const response: any = await fetcher({
        url: `${CHECKOUT_ENDPOINT}/${orderId}/payment-response`,
        method: 'put',
        data: model,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })

      return response
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
