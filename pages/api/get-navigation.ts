import getNavTree from '@framework/api/content/getNavTree'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getNavTreeApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await getNavTree(req.cookies)
    res.status(200).json({ nav: response.header, footer: response.footer })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getNavTreeApiMiddleware)
