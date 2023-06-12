import useValidateChangedUsernameOTP from '@framework/api/endpoints/notification/validate-change-username-otp'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ValidateChangedUsernameOTPApiMiddleware = async (req: any, res: any) => {
  const { mobileNo, otp } = req.body
  try {
    const response = await useValidateChangedUsernameOTP({
      mobileNo,
      otp,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default ValidateChangedUsernameOTPApiMiddleware
