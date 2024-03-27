// Other Imports
import fetcher from '@framework/fetcher'
import { NOTIFICATION_OTP_ENDPOINT } from '@components//utils/constants'

export default async function useNotificationOTP({
  mobileNo,
  entityType,
  templateId,
  cookies,
}: any) {
  try {
    const response = await fetcher({
      url: `${NOTIFICATION_OTP_ENDPOINT}`,
      method: 'POST',
      data: {
        mobileNo: mobileNo,
        entityType: entityType,
        templateId: templateId,
      },
      cookies: cookies,
    })
    return response
  } catch (error: any) {
    console.log(error)
    return { hasError: true, error: error?.message }
  }
}
