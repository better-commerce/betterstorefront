import fetcher from '../../fetcher'
import { SEARCH_ADVANCED_ENDPOINT } from '@components/utils/constants'

export default async function getCategoryProducts(
  categoryId: string,
  cookies?: any
) {
  try {
    const response: any = await fetcher({
      url: SEARCH_ADVANCED_ENDPOINT,
      method: 'post',
      data: { categoryId },
      cookies,
    })
    return response.result
  } catch (error: any) {
    throw new Error(error)
  }
}
