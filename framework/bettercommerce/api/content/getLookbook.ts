import fetcher from '../../fetcher'
import { LOOKBOOK_ENDPOINT } from '@components/utils/constants'
export default function getLookbook(stockcode: string, cookies?: any) {
  async function getLookbookAsync() {
    const url = `${LOOKBOOK_ENDPOINT}?stockcode=${stockcode}`;
    try {
      const response: any = await fetcher({
        url ,
        method: 'GET',
        cookies
      })
      return response.result
    } catch (error: any) {
      // console.log(error)
      // throw new Error(error.message)
    }
  }
  return getLookbookAsync()
}
