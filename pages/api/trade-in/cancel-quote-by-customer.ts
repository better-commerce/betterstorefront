import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import cancelQuoteByCustomerStatus from '@framework/trade-in/cancel-quote-by-customer'

const cancelQuoteByCustomerStatusApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { id, status } = req.body?.data || req.body; // ✅ Fix for extra `data`

  if (!id) {
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response = await cancelQuoteByCustomerStatus(id, status, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(cancelQuoteByCustomerStatusApiMiddleware)
