import fetcher from '../../fetcher'
import { ORDERS_ENDPOINT } from '@components/utils/constants'
interface Props {
  id?: string
}
export default function cancelOrder() {
  return async function handler(id?: string) {
    const url = `${ORDERS_ENDPOINT}/${id}/cancel`;
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      // console.log(error, 'err')
      throw new Error(error.message)
    }
  }
}
