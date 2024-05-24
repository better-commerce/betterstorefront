import getStores from '@framework/store-locator/get-stores'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function getStoresApiMiddleware(req: any, res: any) {
  const { postCode } = req.body // == const postCode = req.body.postCode
  try {
    const response = await getStores(postCode, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getStoresApiMiddleware)
