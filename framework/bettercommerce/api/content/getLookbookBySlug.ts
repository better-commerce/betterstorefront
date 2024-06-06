import { logError } from '@framework/utils/app-util';
import fetcher from '../../fetcher'
import { LOOKBOOK_SLUG_ENDPOINT } from '@components/utils/constants'

export default function getSingleLookbook(slug: string, cookies?: any) {
  async function getSingleLookbookAsync() {
    const url = `${LOOKBOOK_SLUG_ENDPOINT}?slug=${slug}`;
    try {
      const response: any = await fetcher({
        url,
        method: 'GET',
        cookies,
      })
      return { ...response.result, ...{ snippets: response?.snippets } };
    } catch (error: any) {
      // throw new Error(error.message)
      logError(error)
    }
  }
  return getSingleLookbookAsync()
}
