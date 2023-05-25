import { useLogin } from '@framework/auth'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const LoginApiMiddleware = async (req: any, res: any) => {
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
};

export default LoginApiMiddleware;