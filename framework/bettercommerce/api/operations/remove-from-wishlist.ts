import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function removeFromWishlist() {
  async function removeFromWishlistAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${query.id}/wishlist/${query.productId}/remove/${query.flag}`,
        method: 'post',
        data: query,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return removeFromWishlistAsync
}
