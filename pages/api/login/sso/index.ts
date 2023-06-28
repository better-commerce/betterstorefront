import useSSOLogin from '@framework/auth/use-sso-login'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const SSOLoginApiMiddleware = async (req: any, res: any) => {
  const { email, password }: any = req.body.data
  try {
    const response = await useSSOLogin()({
      email,
      password,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default SSOLoginApiMiddleware
