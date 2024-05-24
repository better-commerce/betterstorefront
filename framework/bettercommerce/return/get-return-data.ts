import { RETURNS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getReturnData(orderId: string, cookies?: any) {
  try {
    const res = await fetcher({
      url: RETURNS_ENDPOINT + '/' + orderId,
      method: 'get',
      cookies,
    })
    return res
  } catch (error: any) {
    logError(error)
    throw new Error(error)
  }
}
