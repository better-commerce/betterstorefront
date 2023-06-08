import useNotificationOTP from '@framework/api/endpoints/notification/otp'

export default async (req: any, res: any) => {
  try {
    const { mobileNo, entityType, templateId } = req.body
    const response = await useNotificationOTP({
      mobileNo,
      entityType,
      templateId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
