import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import postQuoteAsUser from '@framework/trade-in/quote-as-user'

const postQuoteAsUserApiMiddleware = async (
  req: any,
  res: any,
) => {
  try {
    const response = await postQuoteAsUser(req.body?.data, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
export default apiRouteGuard(postQuoteAsUserApiMiddleware)
