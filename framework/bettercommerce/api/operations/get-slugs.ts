import fetcher from '../../fetcher'
import { SITEVIEW_ENDPOINT } from '@components/utils/constants'

export default function getSlugsOperation() {
  async function getSlugs({ slug = '/' }: any) {
    try {
      const response: any = await fetcher({
        url: `${SITEVIEW_ENDPOINT}/slug?slug=${slug}`,
        method: 'post',
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
