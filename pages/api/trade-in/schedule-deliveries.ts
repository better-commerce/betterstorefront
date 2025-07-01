import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import getScheduleDeliveryById from '@framework/trade-in/schedule-delivery'

const getScheduleDeliveryByIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body?.quoteId) {
    return res.status(400).json({ error: 'Missing quote ID' })
  }

  try {
    const response: any = await getScheduleDeliveryById(req?.body?.quoteId, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getScheduleDeliveryByIdApiMiddleware)
