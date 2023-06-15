import { loginCheckout } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const LoginCheckoutApiMiddleware = async (req: any, res: any) => {
  const { basketId, email, password }: any = req.body
  try {
    const response = await loginCheckout()({
      basketId,
      email,
      password,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default LoginCheckoutApiMiddleware;