import getAllStores from '@framework/storeLocator/getAllStores'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function getAllStoresApiMiddleware(req: any, res: any) {
  try {
    const response = await getAllStores(req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getAllStoresApiMiddleware)
