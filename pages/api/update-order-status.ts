import { updateOrder } from '@framework/checkout/update-order'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function updateOrderStatus(req: any, res: any) {
  try {
    await updateOrder(req.body.id, req.body.paymentIntent)
    res.status(200).json({ updated: true })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
