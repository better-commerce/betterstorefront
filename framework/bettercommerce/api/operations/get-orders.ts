import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function getOrders() {
  async function getOrdersAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${query.id}/orders?hasMembership=${query.hasMembership}`,
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
