import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function createREview() {
  async function createREviewAsync(query: any) {
    console.log(query, 'query')
    const { title, rating, comment, userId, userEmail, productId, nickname } =
      query
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${productId}/review`,
        method: 'post',
        data: {
          title,
          rating,
          comment,
          userId,
          userEmail,
          nickname,
        },
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
  return createREviewAsync
}
