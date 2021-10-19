import fetcher from '../../fetcher'
import { NAV_ENDPOINT } from '@components/utils/constants'
export default function getNavTree() {
  async function getNavTreeAsync() {
    try {
      const response: any = await fetcher({
        url: NAV_ENDPOINT,
        method: 'GET',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getNavTreeAsync()
}
