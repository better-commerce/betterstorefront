import createReturn from '@framework/return/create'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function createReturnApiMiddleware(req: any, res: any) {
  try {
    const response = await createReturn(req.body.model, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(createReturnApiMiddleware)
