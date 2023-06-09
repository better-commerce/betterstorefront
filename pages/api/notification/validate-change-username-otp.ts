import useValidateChangedUsernameOTP from '@framework/api/endpoints/notification/validate-change-username-otp'

export default async (req: any, res: any) => {
  try {
    const { mobileNo, otp } = req.body
    const response = await useValidateChangedUsernameOTP({
      mobileNo,
      otp,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
