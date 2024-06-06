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
      // console.log(error);
    }
  }
  return getSingleLookbookAsync()
}
