import useGetBasketPromotions from '@framework/cart/use-get-basket-promotions'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
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
