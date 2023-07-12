import { useLogin } from '@framework/auth'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  const { email, password }: any = req.body.data
  try {
    const response = await useLogin()({
      email,
      password,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
