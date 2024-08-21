import fetcher from '../../fetcher'
import { EmptyObject, SITEVIEW_ENDPOINT } from '@components/utils/constants'

export default function getSlugsOperation() {
  async function getSlugs({ slug = '/', cookies = EmptyObject }: any) {
    try {
      const response: any = await fetcher({
        url: `${SITEVIEW_ENDPOINT}/slug?slug=${slug}`,
        method: 'post',
        cookies
      })
      return { ...response?.result, snippets: response?.snippets ?? [] };
      //return response?.result
    } catch (error) {
      console.log(error)
      return null;
    }
  }
  return getSlugs
}
