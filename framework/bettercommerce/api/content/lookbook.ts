import fetcher from '../../fetcher'
import { EmptyObject, LOOKBOOK_ENDPOINT } from '@components/utils/constants'
export default function getLookbook(cookies = EmptyObject) {
  async function getLookbookAsync() {
    try {
      const response: any = await fetcher({
        url: LOOKBOOK_ENDPOINT,
        method: 'GET',
        cookies
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getLookbookAsync()
}
