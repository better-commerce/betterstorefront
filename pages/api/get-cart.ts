import { useCart } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import { getOrderDetails } from '@framework/checkout'
import { Guid } from '@commerce/types'

async function getCartApiMiddleware(req: any, res: any) {
  const { basketId }: any = req.query
  try {
    let response: any = await useCart()({
      basketId,
      cookies: req.cookies,
    })

    response.isPartialPayment = false
    if (response?.orderId && response?.orderId !== Guid.empty) {
      const { result: orderResult }: any = await getOrderDetails()(response?.orderId, req?.cookies)
      
      if (orderResult?.payments?.length) {
        const partialPayments = orderResult?.payments?.filter((x: any) => x?.isPartialPaymentEnabled)
        if (partialPayments?.length) {
          response.isPartialPayment = (partialPayments?.length > 0)
          const totalOrderPartiallyPaid = partialPayments?.reduce((sum: any, x: any) => sum + x.paidAmount, 0) || 0
          response.paidAmount = totalOrderPartiallyPaid
        }
      }

    }
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCartApiMiddleware)
