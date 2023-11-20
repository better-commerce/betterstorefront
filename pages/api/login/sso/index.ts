import useSSOLogin from '@framework/auth/use-sso-login'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from 'pages/api/base/api-route-guard'

async function ssoLoginApiMiddleware(req: any, res: any) {
  const { username, firstName, lastName, mobile, socialMediaType }: any =
    req.body
  try {
    const response = await useSSOLogin()({
      username,
      firstName,
      lastName,
      mobile,
      socialMediaType,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(ssoLoginApiMiddleware)
