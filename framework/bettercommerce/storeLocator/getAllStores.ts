import fetcher from '../fetcher'
import { STORE_LOCATOR_ALL_API } from '@components/utils/constants'
export default async function getAllStores(cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${STORE_LOCATOR_ALL_API}`,
      method: 'get',
      cookies,
    })
    return response.result
  } catch (error) {
    console.log(error)
  }
}
