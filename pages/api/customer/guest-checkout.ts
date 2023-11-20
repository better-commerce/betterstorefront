import { guestCheckout } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const guestCheckoutApiMiddleware = async (req: any, res: any) => {
  const { basketId, email, notifyByEmail, notifyBySms, notifyByPost }: any =
    req.body
  try {
    const response = await guestCheckout()({
      basketId,
      email,
      notifyByEmail,
      notifyBySms,
      notifyByPost,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(guestCheckoutApiMiddleware)
