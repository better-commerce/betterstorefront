import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import getCustomerReturnDetails from '@framework/checkout/customer-return-details'

const getCustomerOrderDetailsApiMiddleware = async (req: any, res: any) => {
  const { id, returnId }: any = req.body
  try {
    const response: any = await getCustomerReturnDetails()(
      id,
      returnId,
      req?.cookies
    )
    res.status(200).json({ order: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCustomerOrderDetailsApiMiddleware)
