import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components//utils/constants'
export default function getCollectionById(id: string, cookies?: any) {
  async function getCollectionByIdAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + `/id/${id}`,
        method: 'get',
        cookies: cookies,
      })
      return { ...response.result, ...{ snippets: response?.snippets ?? [] } }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionByIdAsync()
}
