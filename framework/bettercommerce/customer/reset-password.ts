import fetcher from '../fetcher'
import { CUSTOMER_BASE_API } from '@components//utils/constants'

interface ForgotPassword {
  userName: string
  token: string
  password: string
}

export default async function resetPassword(
  forgotPasswordData: ForgotPassword,
  cookies?: any
) {
  try {
    const endpoint = `${CUSTOMER_BASE_API}/password/reset`
    const res = await fetcher({
      url: endpoint,
      method: 'PUT',
      data: forgotPasswordData,
      cookies,
    })
    return res
  } catch (error) {
    console.log(error)
  }
}
