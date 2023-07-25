import { updateShipping } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const updateShippingApiMiddleware = async (req: any, res: any) => {
  const { basketId, countryCode, shippingId }: any = req.body
  try {
    const response = await updateShipping()({
      basketId,
      countryCode,
      shippingId,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateShippingApiMiddleware)
