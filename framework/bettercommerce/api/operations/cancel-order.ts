import fetcher from '../../fetcher'
import { ORDERS_ENDPOINT } from '@new-components/utils/constants'
interface Props {
  id?: string
}
export default function cancelOrder() {
  return async function handler(id?: string, cookies?: any) {
    const url = `${ORDERS_ENDPOINT}/${id}/cancel`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      // console.log(error, 'err')
      throw new Error(error.message)
    }
  }
}
