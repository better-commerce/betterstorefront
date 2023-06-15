import useNotificationOTP from '@framework/api/endpoints/notification/otp'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const OTPNotificationApiMiddleware = async (req: any, res: any) => {
  const { mobileNo, entityType, templateId } = req.body
  try {
    const response = await useNotificationOTP({
      mobileNo,
      entityType,
      templateId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default OTPNotificationApiMiddleware
