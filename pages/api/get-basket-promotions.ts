import useGetBasketPromotions from '@framework/cart/use-get-basket-promotions'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function getBasketPromotionsApiMiddleware(req: any, res: any) {
  const { basketId }: any = req.query
  try {
    const response = await useGetBasketPromotions()({
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getBasketPromotionsApiMiddleware)
