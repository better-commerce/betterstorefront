import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  data: any
  id: string
}

export default function getShippingPlans() {
  return async function handler({ data, id }: Props) {
    const url = `${BASKET_ENDPOINT}/${id}/updateDeliveryPlan`

    try {
      const response: any = await fetcher({
        url: url,
        method: 'post',
        data: qs.stringify({ ...data }),
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response
    } catch (error: any) {
      console.log(error, 'error')
      // throw new Error(error.message)
    }
  }
}
