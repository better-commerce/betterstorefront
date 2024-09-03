import downloadOrderInvoice from '@framework/checkout/download-order-invoice'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function downloadOrderInvoiceMiddleware(req: any, res: any) {
  try {
    const response = await downloadOrderInvoice()({
      data: req?.body,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(downloadOrderInvoiceMiddleware)
