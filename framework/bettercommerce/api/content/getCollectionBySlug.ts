import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@new-components/utils/constants'
export default function getCollectionBySlug(slug: string, cookies?: any) {
  async function getCollectionBySlugAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + `/slug-minimal/?slug=${slug}`,
        method: 'get',
        cookies,
      })
      return {
        ...response.result,
        ...{ snippets: response?.snippets ?? [] },
        ...{ status: response?.status },
      }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionBySlugAsync()
}
