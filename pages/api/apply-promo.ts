import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const applyPromoApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.applyPromo({
      basketId: req.body.basketId,
      promoCode: req.body.promoCode,
      method: req.body.method,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(applyPromoApiMiddleware)
