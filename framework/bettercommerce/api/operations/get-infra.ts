import { EmptyObject, INFRA_ENDPOINT } from '@components/utils/constants'
import fetcher from '@framework/fetcher';

export default function getInfraOperation() {
  async function getInfra(cookies = EmptyObject) {
    try {
      const headers = {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      };
      const response = await fetcher({
        url: INFRA_ENDPOINT,
        method: 'get',
        cookies,
        headers,
      })
      return response?.result;
    } catch (error) {
      console.log(error);
    }
  }
  return getInfra;
}
