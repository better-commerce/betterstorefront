import { NAV_ENDPOINT } from '@components/utils/constants'
import { cachedGetData } from '../utils/cached-fetch';

export default function getNavTree(cookies?: any) {
  async function getNavTreeAsync() {
    try {
      const response: any = await cachedGetData(NAV_ENDPOINT, cookies);
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getNavTreeAsync()
}
