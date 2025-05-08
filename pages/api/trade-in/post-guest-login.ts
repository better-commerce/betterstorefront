import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import postGuestLogin from '@framework/trade-in/post-guest-login'
import { Cookie } from '@framework/utils/constants'
import { encrypt } from '@framework/utils/cipher'
import { USER_TOKEN_COOKIE_OPTIONS } from '../login'
import cookie from 'cookie';

const postGuestLoginApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await postGuestLogin(req.body?.data, req?.cookies)
    if (response?.customerId && response?.userToken?.access_token) {

      // Clip userToken information from the actual response that is sent to the UI layer.
      const { userToken, ...rest } = response
      const serializedCookie = cookie.serialize(Cookie.Key.USER_TOKEN,encrypt(response.userToken.access_token), USER_TOKEN_COOKIE_OPTIONS);
      res.setHeader('Set-Cookie', serializedCookie);
      res.status(200).json({ ...rest })
    } else {
      res.status(200).json(response)
    }
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
export default apiRouteGuard(postGuestLoginApiMiddleware)
