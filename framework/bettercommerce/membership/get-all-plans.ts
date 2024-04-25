import fetcher from '@framework/fetcher'
import { MEMBERSHIP_PLANS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function getAllPlans(body?:any, cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${MEMBERSHIP_PLANS}`,
      data: body,
      method: 'post',
      cookies,
    })
    return response.result
  } catch (error) {
    logError(error)
  }
}
