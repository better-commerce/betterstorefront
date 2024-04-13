import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import useDeleteCart from '@framework/cart/use-delete-cart'

const deleteCartApiMiddleware = async (req: any, res: any) => {
  const { basketId }: any = req.body
  try {
    const response = await useDeleteCart()({
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(deleteCartApiMiddleware)
