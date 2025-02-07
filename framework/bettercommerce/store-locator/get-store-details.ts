import { EmptyObject, GET_STORES_DETAILS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getStoreDetails(id: string, cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: `${GET_STORES_DETAILS}/${id}`,
      method: 'get',
      cookies
    })
    return response?.result
  } catch (error: any) {
    logError(error)
  }
}
