import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import getStockCheck from '@framework/product/get-stock-check'

async function getStockCheckApiMiddleware(req: any, res: any) {
  const stockCode = req.body.StockCode // ✅ Corrected casing
  try {
    const response = await getStockCheck(stockCode, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getStockCheckApiMiddleware)
