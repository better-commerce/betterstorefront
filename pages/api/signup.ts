import { useSignup } from '@framework/auth'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const SignupApiMiddleware = async (req: any, res: any) => {
  const { email, password, confirmPassword, firstName, lastName }: any =
    req.body.data
  try {
    const response = await useSignup()({
      Email: email,
      Password: password,
      confirmPassword,
      firstName,
      lastName,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default SignupApiMiddleware;