import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import statusUpdateRFQ from '@framework/b2b/refer-for-quote/status-update'

const updateRFQStatusApiMiddleware = async (req: any, res: any) => {
    const { id, ...data }: any = req?.body
    
  try {
    const response = await statusUpdateRFQ()(id , data, req?.cookies)

    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateRFQStatusApiMiddleware)
