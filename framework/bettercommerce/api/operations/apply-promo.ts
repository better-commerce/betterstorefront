import fetcher from '../../fetcher'
import { PROMOTIONS_ENDPOINT } from '@components/utils/constants'
import { PROMOTIONS_BASE_URL } from '@framework/utils/constants'

export default function applyPromo() {
  async function applyPromoAsync(query: any) {
    const { basketId, promoCode, method = 'apply', cookies } = query
    let httpMethod = method === 'remove' ? 'delete' : 'post'
    try {
      const response: any = await fetcher({
        url: `${PROMOTIONS_ENDPOINT}/${basketId}/promo/${promoCode}/${method}`,
        method: httpMethod,
        cookies,
        baseUrl: PROMOTIONS_BASE_URL
      })
      return response
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return applyPromoAsync
}
