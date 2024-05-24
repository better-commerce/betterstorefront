import fetcher from '@framework/fetcher'
import { GET_ALL_STORES } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function getAllStores(cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${GET_ALL_STORES}`,
      method: 'get',
      cookies,
    })
    return response.result
  } catch (error) {
    logError(error)
  }
}
