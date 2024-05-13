import { AUTHENTICATE_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'
import { logError } from '@framework/utils/app-util'
import { UserAuthType } from '@framework/utils/constants'

interface Props {
  email: string
  cookies?: any
  password: string
  authType?: number
}

export default function useLogin() {
  return async function handler({ email, password, authType = UserAuthType.DEFAULT, cookies }: Props) {
    const data = {
      username: email,
      password,
      authType,
    }

    try {
      const response: any = await fetcher({
        url: `${AUTHENTICATE_CUSTOMER}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      logError(error)
      throw new Error(error.message)
    }
  }
}
