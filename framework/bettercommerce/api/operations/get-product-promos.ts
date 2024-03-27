import fetcher from '../../fetcher'
import { PRODUCT_PROMOTION_API_ENDPOINT } from '@components//utils/constants'
export default function useGetProductPromos() {
  async function useGetProductPromosAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_PROMOTION_API_ENDPOINT}?productId=${query}`,
        method: 'get',
        cookies,
      })
      return {
        promotions: response.result,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetProductPromosAsync
}
