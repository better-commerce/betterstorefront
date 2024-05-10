import { guestCheckout } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import useGetCustomer from '@framework/customer/use-get-customer'
import { Guid } from '@commerce/types'

const guestCheckoutApiMiddleware = async (req: any, res: any) => {
  const { basketId, email, notifyByEmail, notifyBySms, notifyByPost }: any = req.body
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
