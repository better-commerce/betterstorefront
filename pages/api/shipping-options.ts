import { useShipping } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function shippingOptionsApiMiddleware(req: any, res: any) {
  const { basketId, countryCode, postCode, method }: any = req.body
  try {
    const response = await useShipping()({
      basketId,
      countryCode,
      postCode,
      cookies: req.cookies,
      method,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(shippingOptionsApiMiddleware)
