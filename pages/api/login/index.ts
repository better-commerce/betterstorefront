import { useLogin } from '@framework/auth'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { encrypt } from '@framework/utils/cipher'
import { Cookie } from '@framework/utils/constants'

async function loginApiMiddleware(req: any, res: any) {
  const { email, password, authType }: any = req.body.data
  try {
    const response = await useLogin()({
      email,
      password,
      authType,
      cookies: req.cookies,
    })

    if (response?.userId && response?.userToken?.access_token) {

      // Clip userToken information from the actual response that is sent to the UI layer.
      const { userToken, ...rest } = response
      const opts = {
        httpOnly: true, // Cookie is not accessible via client-side JavaScript
        secure: (process.env.NODE_ENV === 'production'), // Send only over HTTPS in production
        sameSite: 'lax', // Helps protect against CSRF attacks
      }
      res.cookie(Cookie.Key.USER_TOKEN, encrypt(response?.userToken?.access_token), opts);
      res.status(200).json({ ...rest })
    } else {
      res.status(200).json(response)
    }
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(loginApiMiddleware)
