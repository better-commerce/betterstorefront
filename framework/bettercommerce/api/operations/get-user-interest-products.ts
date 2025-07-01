import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function getUserInterestProducts() {
  async function getUserInterestProductsAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${query.id}/product-interest?currentPage=1&pageSize=10`,
        method: 'get',
        data: query,
        cookies,
      })
      return response.results
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getUserInterestProductsAsync
}
