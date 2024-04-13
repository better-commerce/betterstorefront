import { OMS_BASE_URL } from '@framework/utils/constants'
import { STORE_LOCATOR_API } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getStores(postCode: string, cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${STORE_LOCATOR_API}/${postCode}`,
      method: 'get',
      data: { postCode: postCode },
      baseUrl: OMS_BASE_URL,
      cookies,
    })
    return response.Result
  } catch (error) {
    logError(error)
  }
}
