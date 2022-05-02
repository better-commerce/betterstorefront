import fetcher from '../../fetcher'
import { INFRA_ENDPOINT } from '@components/utils/constants'

export default function getInfraOperation() {
  async function getInfra() {
    //console.log(slug);
    try {
      const response: any = await fetcher({
        url: `${INFRA_ENDPOINT}`,
        method: 'get',
      });
      return response?.result;
    } catch (error) {
      console.log(error);
    }
  }
  return getInfra;
}
