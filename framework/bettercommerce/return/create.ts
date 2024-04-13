import { RETURNS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

export default async function createReturn(model: any, cookies: any) {
  try {
    const res = await fetcher({
      url: RETURNS_ENDPOINT + '/create',
      method: 'post',
      data: JSON.stringify({ ...model }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cookies,
    })
    return res
  } catch (error: any) {
    logError(error)
    throw new Error(error)
  }
}
