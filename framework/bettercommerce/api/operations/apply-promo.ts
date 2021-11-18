import fetcher from '../../fetcher'
import { BASKET_ENDPOINT } from '@components/utils/constants'
export default function applyPromo() {
  async function applyPromoAsync(query: any) {
    const { basketId, promoCode, method = 'apply' } = query
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/promo/${promoCode}/${method}`,
        method: 'post',
      })
      return response
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return applyPromoAsync
}
