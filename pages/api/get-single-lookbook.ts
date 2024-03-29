import getSingleLookbook from '@framework/api/content/singleLookbook'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getSingleLookbookapiMiddleware = async (req: any, res: any) => {
  const { slug } = req.body
  try {
    const response = await getSingleLookbook(slug, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getSingleLookbookapiMiddleware)
