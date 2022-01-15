import fetcher from '../../fetcher'
import { SEARCH_ADVANCED_ENDPOINT } from '@components/utils/constants'

export default async function getCategoryProducts(categoryId: string) {
  try {
    const response: any = await fetcher({
      url: SEARCH_ADVANCED_ENDPOINT,
      method: 'post',
      data: { categoryId },
    })
    return response.result
  } catch (error: any) {
    throw new Error(error)
  }
}
