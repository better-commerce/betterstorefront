import { getUserCarts } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getUserCartsApiMiddleware = async (req: any, res: any) => {
  const { userId }: any = req.query
  try {
    const response = await getUserCarts()({
      userId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getUserCartsApiMiddleware)
