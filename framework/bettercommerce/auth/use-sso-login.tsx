import { SOCIAL_AUTHENTICATE_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  username: string
  firstName: string
  lastName: string
  mobile: string
  socialMediaType: string
  cookies?: any
}

export default function useSSOLogin() {
  return async function handler({
    username,
    firstName,
    lastName,
    mobile,
    socialMediaType,
    cookies,
  }: Props) {
    const data = {
      username,
      firstName,
      lastName,
      mobile,
      socialMediaType,
    }

    try {
      const response: any = await fetcher({
        url: `${SOCIAL_AUTHENTICATE_CUSTOMER}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
