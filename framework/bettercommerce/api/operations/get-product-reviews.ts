import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function useGetProductReviews() {
  async function useGetProductReviewsAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${query}/review`,
        params: {
          currentPage: 1,
          pageSize: 100,
        },
        method: 'get',
        cookies,
      })
      return {
        review: response.result,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetProductReviewsAsync
}
