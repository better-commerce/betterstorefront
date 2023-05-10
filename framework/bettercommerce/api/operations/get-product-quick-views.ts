
import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function useGetProductQuickviews() {
  async function useGetProductQuickviewsAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}/quickview?slug=${query}`,
        method: 'get',
      })
      return {
        product: response.result
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetProductQuickviewsAsync
}
