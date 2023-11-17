import { getCompareProductAttributes } from '@framework/api/operations'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function compareProductAttributes(req: any, res: any) {
  try {
    const response = await getCompareProductAttributes(req.body.stockCodes, req.body.compareAtPLP, req.body.compareAtPDP, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(compareProductAttributes)
