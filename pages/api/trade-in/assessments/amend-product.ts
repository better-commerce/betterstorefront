import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import amendProduct from '@framework/trade-in/assessments/amend-product'

const amendProductApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  } // ✅ Fix for extra `data`

  if (!req?.body?.id) {
    return res.status(400).json({ error: 'Missing assessment ID' })
  }

  try {
    const response = await amendProduct(req?.body?.id, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(amendProductApiMiddleware)
