import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import postQuoteAddress from '@framework/trade-in/post-quote-address'
import { logError } from '@framework/utils/app-util'

const postQuoteAddressApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { id, ...addressData } = req.body?.data

  if (!id) {
    console.error('Error: Missing quote ID in request body')
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response: any = await postQuoteAddress(
      addressData,
      id,
      req?.cookies
    )
    res.status(200).json(response)
  } catch (error) {
    logError(error)
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(postQuoteAddressApiMiddleware)
