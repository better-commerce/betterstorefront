import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import commerce from '@lib/api/commerce'

async function getReviewSummaryMiddleware(req: any, res: any) {
  try {
    const response = await commerce.getReviewSummary(req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getReviewSummaryMiddleware)
