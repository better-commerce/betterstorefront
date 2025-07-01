import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import updateProductAccessories from '@framework/trade-in/assessments/update-product-accessories'

const updateProductAccessoriesApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body.payload) {
    return res.status(400).json({ error: 'Missing payload!' })
  }

  try {
    const response = await updateProductAccessories(req?.body?.id ,req?.body?.payload, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateProductAccessoriesApiMiddleware)