import { getOrderDetails } from '@framework/checkout'
import apiRouteGuard from '../base/api-route-guard'

const orderDetailsApiMiddleware = async (req: any, res: any) => {
  const { id }: any = req.body
  try {
    const response: any = await getOrderDetails()(id, req?.cookies)
    res.status(200).json({ order: response.result })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default apiRouteGuard(orderDetailsApiMiddleware)
