import getCollectionById from '@framework/api/content/getCollectionById'
import { getCategoryProducts } from '@framework/api/operations'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function categoryProducts(req: any, res: any) {
  try {
    const response = await getCollectionById(req.body.recordId, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(categoryProducts)
