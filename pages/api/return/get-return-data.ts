import getReturnData from '@framework/return/get-return-data'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function getReturnDataApiMiddleware(req: any, res: any) {
  try {
    const response = await getReturnData(req.body.orderId, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getReturnDataApiMiddleware)
