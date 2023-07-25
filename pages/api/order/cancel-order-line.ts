import useCancelOrderLine from '@framework/checkout/cancel-order-line'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function cancelOrderLineApiMiddleware(req: any, res: any) {
  try {
    const response = await useCancelOrderLine()({
      data: req?.body,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(cancelOrderLineApiMiddleware)
