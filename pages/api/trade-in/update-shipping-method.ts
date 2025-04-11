import apiRouteGuard from '../base/api-route-guard'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import updateShippingMethod from '@framework/trade-in/update-shipping-method'

const updateShippingMethodApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const response: any = await updateShippingMethod(req.body, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateShippingMethodApiMiddleware)
