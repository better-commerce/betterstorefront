import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function getWishlist() {
  async function getWishlistAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${query.id}/wishlist?saveForLater=${query.flag}`,
        method: 'get',
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getWishlistAsync
}
