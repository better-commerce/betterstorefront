import { BASE_SEARCH_ENDPOINT } from '@components/utils/constants'
import fetcher from '../../fetcher'
interface Props {
  value: any
  cookies: any
}

export default function searchProducts() {
  return async function handler({ value, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${BASE_SEARCH_ENDPOINT}/${value}`,
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
