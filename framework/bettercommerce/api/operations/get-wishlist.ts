import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function getWishlist() {
  async function getWishlistAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}/${query.id}/wishlist/${query.flag}`,
        method: 'get',
        data: query,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getWishlistAsync
}
