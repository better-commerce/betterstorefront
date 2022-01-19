import { KEYWORDS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../../fetcher'

export default async function useKeywords() {
  try {
    const response: any = await fetcher({
      url: `${KEYWORDS_ENDPOINT}`,
      method: 'get',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
    })
    return response
  } catch (error: any) {
    console.log(error)
    // throw new Error(error.message)
  }
}
