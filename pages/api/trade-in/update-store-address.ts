import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import updateStoreAddress from '@framework/trade-in/update-store-address'

const updateStoreAddressApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { id, storeid } = req.body?.data || {} // Get ID from request body

  if (!id) {
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response: any = await updateStoreAddress(
      id,
      storeid,
      req?.cookies
    )
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateStoreAddressApiMiddleware)
