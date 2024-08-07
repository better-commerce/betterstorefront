import {
  BASE_SEARCH_ENDPOINT,
  SEARCH_MINIMAL_ENDPOINT,
} from '@components/utils/constants'
import fetcher from '../../fetcher'
interface Props {
  value: any
  cookies: any
  sortBy: any
}

export default function searchProducts() {
  return async function handler({ value, cookies, sortBy }: Props) {
    try {
      const response: any = await fetcher({
        url: `${SEARCH_MINIMAL_ENDPOINT}`,
        data: { freeText: value, sortBy: sortBy },
        method: 'post',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
