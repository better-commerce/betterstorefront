import { updateAddress } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const updateAddressApiMiddleware = async (req: any, res: any) => {
  const { basketId, model }: any = req.body
  try {
    const response = await updateAddress()({
      basketId,
      model,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateAddressApiMiddleware)
