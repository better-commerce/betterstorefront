import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import postQuote from '@framework/trade-in/post-quote'

const postQuoteapiMiddleware = async (req: any, res: any) => {
  const { data } = req.body
  try {
    const response = await postQuote(data, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(postQuoteapiMiddleware)
