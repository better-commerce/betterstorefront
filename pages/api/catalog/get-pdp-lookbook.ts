import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const getPDPLookbookApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpLookbook({
      query: req.body.stockCode,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getPDPLookbookApiMiddleware)
