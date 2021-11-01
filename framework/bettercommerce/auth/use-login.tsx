import { AUTHENTICATE_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  email: string
  password: string
}

export default function useLogin() {
  return async function handler({ email, password }: Props) {
    const data = {
      email,
      password,
    }

    try {
      const response: any = await fetcher({
        url: `${AUTHENTICATE_CUSTOMER}`,
        method: 'post',
        data,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
