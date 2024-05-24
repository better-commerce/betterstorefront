import fetcher from '../../fetcher'
import { PROMOTION_API_ENDPOINT } from '@components/utils/constants'

export default function getPromotionOperation() {
  async function getPromotion(promoCode:any) {
    try {
      const response: any = await fetcher({
        url: `${PROMOTION_API_ENDPOINT}/${promoCode}`,
        method: 'get',
      })
      return { result: response?.result, snippets: response?.snippets ?? [] }
    } catch (error) {
      console.log(error)
      return null
    }
  }
  return getPromotion
}
