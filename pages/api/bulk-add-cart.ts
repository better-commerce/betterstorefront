import { useBulkAdd } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function bulkAddToCartApiMiddleware(req: any, res: any) {
  const { basketId, products }: any = req.body.data
  try {
    const response = await useBulkAdd()({
      basketId,
      products,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(bulkAddToCartApiMiddleware)
