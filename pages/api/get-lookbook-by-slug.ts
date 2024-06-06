import getLookbookBySlug from '@framework/api/content/getLookbookBySlug'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getLookbookBySlugapiMiddleware = async (req: any, res: any) => {
  const { slug } = req.body
  try {
    const response = await getLookbookBySlug(slug, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getLookbookBySlugapiMiddleware)
