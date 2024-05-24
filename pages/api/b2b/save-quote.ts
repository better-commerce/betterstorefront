import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { useB2BSaveQuote } from '@framework/b2b'

const getUserQuotesApiMiddleware = async (req: any, res: any) => {
  const { quote }: any = req?.body
  try {
    const response = await useB2BSaveQuote()({ quote, cookies: req?.cookies })
    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getUserQuotesApiMiddleware)
