import { NAV_ENDPOINT } from '@components/utils/constants'
import fetcher from '@framework/fetcher';

export default async function useNavTree(cookies?: any) {
  try {
    const headers = {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    };
    const response = await fetcher({
      url: NAV_ENDPOINT,
      method: 'get',
      cookies,
      headers,
    })
    return response
  } catch (error: any) {
    console.log(error)
    // throw new Error(error.message)
  }
}
