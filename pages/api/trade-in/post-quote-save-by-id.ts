import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import saveQuoteById from '@framework/trade-in/post-quote-save-by-id'

const getQuoteByIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { id } = req.body // Get ID from request body
  const { status } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response: any = await saveQuoteById(id, status, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getQuoteByIdApiMiddleware)
