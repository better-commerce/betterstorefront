import postQuoteAsGuest from '@framework/trade-in/post-quote-as-guest'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const postQuoteAsGuestapiMiddleware = async (
  req: any,
  res: any,
) => {
  try {
    const response = await postQuoteAsGuest(req.body?.data, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
export default apiRouteGuard(postQuoteAsGuestapiMiddleware)
