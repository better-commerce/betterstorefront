import getLookbook from '@framework/api/content/getLookbook'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getLookbookapiMiddleware = async (req: any, res: any) => {
  const { stockcode } = req.body
  try {
    const response = await getLookbook(stockcode, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getLookbookapiMiddleware)
