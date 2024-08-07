import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { CATEGORY_ENDPOINT } from '@components/utils/constants'

export default async function getAllCategories() {
  try {
    const response: any = await fetcher({
      url: CATEGORY_ENDPOINT,
      method: 'get',
    })
    return response.result
  } catch (error: any) {
    logError(error)
    throw new Error(error)
  }
}
