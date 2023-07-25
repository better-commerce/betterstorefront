import { updateOrder } from '@framework/checkout/update-order'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function updateOrderStatusApiMiddleware(req: any, res: any) {
  try {
    await updateOrder(req.body.id, req.body.paymentIntent, req?.cookies)
    res.status(200).json({ updated: true })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateOrderStatusApiMiddleware)
