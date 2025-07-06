import { logError } from '@framework/utils/app-util'
import { USED_PARENT_ENDPOINT, EmptyObject } from '@components/utils/constants'
import fetcher from '@framework/fetcher'

export default async function getAllUsed(cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: `${USED_PARENT_ENDPOINT}?currentPage=1&pageSize=40`,
      method: 'get',
      cookies, 
      logRequest:true
    })
    return response.result
  } catch (error: any) {
    logError(error)
    throw new Error(error)
  }
}
