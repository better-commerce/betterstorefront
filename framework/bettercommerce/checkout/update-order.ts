import { ORDERS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function updateOrder(id: string, paymentIntent: string) {
  const intent = await stripe.paymentIntents.retrieve(paymentIntent)
  console.log(intent)
  if (intent.status === 'succeeded') {
    const url = ORDERS_ENDPOINT + `/${id}/status`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        data: {
          id: id,
          orderStatusModel: {
            status: 'complete',
            externalStatus: 'complete',
            comment: 'updated from stripe',
            ignoreEmailTrigger: true,
            lastUpdatedBy: 'stripe',
          },
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      console.log(response)
      return response
    } catch (error: any) {
      console.log(error, 'err')
      // throw new Error(error.message)
    }
  }
}
