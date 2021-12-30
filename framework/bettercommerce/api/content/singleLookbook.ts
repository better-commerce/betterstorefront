import fetcher from '../../fetcher'
import { LOOKBOOK_ENDPOINT } from '@components/utils/constants'
export default function getSingleLookbook(slug: string) {
  async function getSingleLookbookAsync() {
    const url = `${LOOKBOOK_ENDPOINT}/slug?slug=lookbook/${slug}`
    console.log(url)
    try {
      const response: any = await fetcher({
        url,
        method: 'GET',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
    }
  }
  return getSingleLookbookAsync()
}
