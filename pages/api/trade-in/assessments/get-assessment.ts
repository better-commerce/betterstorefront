import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import getAssessmentById from '@framework/trade-in/assessments/get-assessment'

const getQuoteByIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body?.id) {
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response: any = await getAssessmentById(req.body.id, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getQuoteByIdApiMiddleware)
