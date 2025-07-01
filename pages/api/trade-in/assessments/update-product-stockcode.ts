import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import updateProductStockcode from '@framework/trade-in/assessments/update-product-stockcode'

const updateProductStockcodeApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body.stockcode) {
    return res.status(400).json({ error: 'Missing stockcode!' })
  }

  try {
    const response = await updateProductStockcode(req?.body?.id ,req?.body?.stockcode, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateProductStockcodeApiMiddleware)
