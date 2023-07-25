import getReturns from '@framework/return/get-user-returns'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function getUserReturnsApiMiddleware(req: any, res: any) {
  try {
    const response = await getReturns(req.body.userId, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getUserReturnsApiMiddleware)
