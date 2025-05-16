import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import updateProductCondition from '@framework/trade-in/assessments/update-product-condition'

const updateProductConditionApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body.condition) {
    return res.status(400).json({ error: 'Missing condition!' })
  }

  try {
    const response = await updateProductCondition(req?.body?.id ,req?.body?.condition, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateProductConditionApiMiddleware)