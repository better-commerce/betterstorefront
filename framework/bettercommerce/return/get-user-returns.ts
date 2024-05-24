import { CUSTOMER_BASE_API } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getReturnData(userId: string, cookies?: any) {
  try {
    const res = await fetcher({
      url: `${CUSTOMER_BASE_API}/${userId}/returns`,
      method: 'get',
      cookies,
    })
    return res
  } catch (error: any) {
    logError(error)
    throw new Error(error)
  }
}
