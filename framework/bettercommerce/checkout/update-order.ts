import { ORDERS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function updateOrder(
  id: string,
  paymentIntent: string,
  cookies?: any,
  status?: string,
  externalStatus?: string,
  comment?: string,
  ignoreEmailTrigger?: boolean,
  lastUpdatedBy?: string
) {
  const intent = await stripe.paymentIntents.retrieve(paymentIntent)
  if (intent.status === 'succeeded') {
    const url = ORDERS_ENDPOINT + `/${id}/status`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        data: {
          id: id,
          orderStatusModel: {
            status: status || 'complete',
            externalStatus: externalStatus || 'complete',
            comment: comment || 'updated from stripe',
            ignoreEmailTrigger: ignoreEmailTrigger || true,
            lastUpdatedBy: lastUpdatedBy || 'stripe',
          },
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
