import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function notifyUser() {
  async function notifyUserAsync(query: any) {
    const { email, productId } = query
    console.log(query, ' ...query')
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${productId}/notifyme`,
        method: 'post',
        data: {
          email,
          id: productId,
        },
      })
      return response.result
    } catch (error: any) {
      // throw new Error(error.message)
    }
  }
  return notifyUserAsync
}
