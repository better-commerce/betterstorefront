import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components/utils/constants'
export default function getCollectionBySlug(slug: string, cookies?: any) {
  async function getCollectionBySlugAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + `/slug-minimal/?slug=${slug}`,
        method: 'get',
        cookies: cookies,
      })
      return { ...response.result, ...{ snippets: response?.snippets ?? [] } };
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionBySlugAsync()
}
