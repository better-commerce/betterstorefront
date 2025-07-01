import { useLogin } from '@framework/auth'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { encrypt } from '@framework/utils/cipher'
import { Cookie } from '@framework/utils/constants'
import cookie, { CookieSerializeOptions } from 'cookie';
import { getMinutesInDays } from '@components/utils/setSessionId'
 
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
      const serializedCookie = cookie.serialize(Cookie.Key.USER_TOKEN,encrypt(response.userToken.access_token), USER_TOKEN_COOKIE_OPTIONS);
      res.setHeader('Set-Cookie', serializedCookie);
      res.status(200).json({ ...rest })
    } else {
      res.status(200).json(response)
    }
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
 
export default apiRouteGuard(loginApiMiddleware)
 
export const USER_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  path: "/",
  httpOnly: (process.env.NODE_ENV === 'production'), // Cookie is not accessible via client-side JavaScript
  secure: (process.env.NODE_ENV === 'production'), // Send only over HTTPS in production
  sameSite: 'lax', // Helps protect against CSRF attacks
  maxAge: getMinutesInDays(365) * 60 * 1000,
}