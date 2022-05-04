import fetcher from '../../fetcherV2'
import { NAV_ENDPOINT } from '@components/utils/constants'
export default function getNavTree(cookies?: any) {
  async function getNavTreeAsync() {
    try {
      const response: any = await fetcher({
        url: NAV_ENDPOINT,
        method: 'GET',
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getNavTreeAsync()
}
