import { retrieveAddress } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const retrieveAddressApiMiddleware = async (req: any, res: any) => {
  const { id }: any = req.body
  try {
    const response = await retrieveAddress()(id, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(retrieveAddressApiMiddleware)
