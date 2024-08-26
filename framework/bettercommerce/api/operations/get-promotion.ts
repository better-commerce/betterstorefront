import fetcher from '../../fetcher'
import { EmptyObject, PROMOTION_API_ENDPOINT } from '@components/utils/constants'

export default function getPromotionOperation() {
  async function getPromotion(promoCode:any, cookies = EmptyObject) {
    try {
      const response: any = await fetcher({
        url: `${PROMOTION_API_ENDPOINT}/${promoCode}`,
        method: 'get',
        cookies
      })
      return { result: response?.result, snippets: response?.snippets ?? [] }
    } catch (error) {
      console.log(error)
      return null
    }
  }
  return getPromotion
}
