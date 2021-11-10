import fetcher from '../../fetcher'
import { ORDERS_ENDPOINT } from '@components/utils/constants'
export default function getOrders() {
  async function getOrdersAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${ORDERS_ENDPOINT}/email?email=${query.email}`,
        method: 'get',
        data: query,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getOrdersAsync
}
