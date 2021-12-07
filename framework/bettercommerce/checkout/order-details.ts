import { ORDERS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  id?: string
}

export default function getOrderDetails() {
  return async function handler(id?: string) {
    const url = ORDERS_ENDPOINT + `/${id}`
    try {
      const response: any = await fetcher({
        url,
        method: 'get',
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
