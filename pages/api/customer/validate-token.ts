import { useValidateToken } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function validateTokenApiMiddleware(req: any, res: any) {
  try {
    const response = await useValidateToken(req.body.token, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(validateTokenApiMiddleware)
