// Other Imports
import fetcher from '@framework/fetcher'
import { VALIDATE_CHANGE_USERNAME_OTP_ENDPOINT } from '@components/utils/constants'

export default async function useValidateChangedUsernameOTP({
  mobileNo,
  otp,
  cookies,
}: any) {
  try {
    const response = await fetcher({
      url: `${VALIDATE_CHANGE_USERNAME_OTP_ENDPOINT}/${mobileNo}/otp/${otp}/validate`,
      method: 'GET',
      cookies: cookies,
    })
    return response
  } catch (error: any) {
    console.log(error)
    return { hasError: true, error: error?.message }
  }
}
