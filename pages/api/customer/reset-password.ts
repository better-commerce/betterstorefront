import { useResetPassword } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function resetPasswordApiMiddleware(req: any, res: any) {
  try {
    const response = await useResetPassword(req.body, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(resetPasswordApiMiddleware)
