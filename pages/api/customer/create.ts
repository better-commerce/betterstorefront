import apiRouteGuard from '../base/api-route-guard'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import { useCreateCustomer } from '@framework/customer'

const createCustomerApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await useCreateCustomer()({
      data: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(createCustomerApiMiddleware)
