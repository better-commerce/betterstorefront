import fetcher from '../fetcher'
import { OMS_BASE_URL } from '@framework/utils/constants'
import { STORE_LOCATOR_API } from '@components//utils/constants'
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
    console.log(error)
  }
}
