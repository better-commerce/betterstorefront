import fetcher from '../fetcher'
import { OMS_BASE_URL } from '@framework/utils/constants'
import { STORE_LOCATOR_API } from '@components/utils/constants'
export default async function getStores(postCode: string) {
  try {
    //const storeURL = new URL(STORE_LOCATOR_API, OMS_BASE_URL)
    const response: any = await fetcher({
      url: STORE_LOCATOR_API,
      method: 'post',
      data: { postCode: postCode },
      baseUrl: OMS_BASE_URL
    })
    return response.result
  } catch (error) { }
}
