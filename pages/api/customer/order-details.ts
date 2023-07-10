import { getCustomerOrderDetails } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetCustomerOrderDetailsApiMiddleware = async (req: any, res: any) => {
  const { id, orderId }: any = req.body
  try {
    const response: any = await getCustomerOrderDetails()(
      id,
      orderId,
      req?.cookies
    )
    res.status(200).json({ order: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetCustomerOrderDetailsApiMiddleware
