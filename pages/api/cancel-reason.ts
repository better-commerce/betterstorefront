import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const cancelReasonApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getCancelReason({
      query: req.body,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '60mb',
    },
  },
}

export default apiRouteGuard(cancelReasonApiMiddleware)
