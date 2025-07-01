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
        const partialPayments = orderResult?.payments?.filter((x: any) => x?.isPartialPaymentEnabled)?.map((x: any) => ({ ...x, paidAmount: (x?.orderAmount === x?.paidAmount) && x?.paymentInfo9 ? parseFloat(x?.paymentInfo9) : x?.paidAmount }))
        if (partialPayments?.length) {
          response.isPartialPayment = (partialPayments?.length > 0) // Set [isPartialPayment] in basket
          const totalOrderPartiallyPaidAmount = partialPayments?.reduce((sum: any, x: any) => sum + x.paidAmount, 0) || 0
          response.paidAmount = totalOrderPartiallyPaidAmount // Set [paidAmount] in basket

          const partialPayableAmount = parseFloat((orderResult?.grandTotal?.raw?.withTax - totalOrderPartiallyPaidAmount).toFixed(2))
          response.partialPayableAmount = { raw: partialPayableAmount, formatted: `${orderResult?.currencySymbol}${partialPayableAmount}` } // Set [partialPayableAmount] in basket

          const filteredPartialPaidPayments = partialPayments?.filter((x: any) => x?.isPartialPaymentEnabled && x?.paidAmount > 0 && x?.orderAmount === orderResult?.grandTotal?.raw?.withTax) || [] 
          const partialPaidPayments = filteredPartialPaidPayments?.map((x: any) => ({ method: x?.paymentGateway, paidAmount: { raw: x?.paidAmount, formatted: `${orderResult?.currencySymbol}${x?.paidAmount}` } }))
          response.partialPayments = partialPaidPayments

          const partialPaidPaymentMethods = filteredPartialPaidPayments?.map((x: any) => x?.paymentGateway)
          response.partialPaidMethods = [...new Set(partialPaidPaymentMethods)] // Set [partialPaidPaymentMethods] in basket
        }
      }

    }
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCartApiMiddleware)
