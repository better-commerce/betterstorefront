import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function notifyUser() {
  async function notifyUserAsync(query: any) {
    const { email, productId } = query
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${email}/notifyme/${productId}`,
        method: 'post',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return notifyUserAsync
}
