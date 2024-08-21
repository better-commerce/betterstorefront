import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components/utils/constants'
export default function getCollections(cookies?: any) {
  async function getCollectionsAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + '/all',
        method: 'get',
        cookies
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionsAsync()
}
