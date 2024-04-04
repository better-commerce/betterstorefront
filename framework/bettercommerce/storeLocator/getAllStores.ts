import fetcher from '@framework/fetcher'
import { GET_ALL_STORES } from '@components/utils/constants'

export default async function getAllStores(cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${GET_ALL_STORES}`,
      method: 'get',
      cookies,
    })
    return response.result
  } catch (error) {
    console.log(error)
  }
}
