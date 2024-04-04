import { GET_STORES_DETAILS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'

export default async function getStoreDetails(id: string) {
  try {
    const response: any = await fetcher({
      url: `${GET_STORES_DETAILS}/${id}`,
      method: 'get',
    })
    return response.result
  } catch (error: any) {
    console.error(error)
  }
}
