import { NAV_ENDPOINT } from '@components/utils/constants'
import { cachedGetData } from '../utils/cached-fetch';

export default function getNavTreeOperation(cookies?: any) {
  async function getNavTree() {
    try {
      const response: any = await cachedGetData(NAV_ENDPOINT, cookies);
      return response?.result;
    } catch (error) {
      console.log(error);
    }
  }
  return getNavTree;
}
