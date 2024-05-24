import { KEYWORDS_ENDPOINT } from '@components/utils/constants'
import fetcher from '@framework/fetcher';
import { logError } from '@framework/utils/app-util';

export default async function useKeywords(cookies?: any) {
  try {
    const headers = {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    };
    const response = await fetcher({
      url: KEYWORDS_ENDPOINT,
      method: 'get',
      cookies,
      headers,
    })
    return response
  } catch (error: any) {
    logError(error)
    // throw new Error(error.message)
  }
}
