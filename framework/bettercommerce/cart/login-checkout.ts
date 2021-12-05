import { SHIPPING_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId: string
  email: string
  password: string
}

export default function useLoginCheckout() {
  return async function handler({ basketId, email, password }: Props) {
    try {
      const response: any = await fetcher({
        url: `${SHIPPING_ENDPOINT}/${basketId}/login-checkout`,
        method: 'post',
        data: {
          email,
          password,
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
