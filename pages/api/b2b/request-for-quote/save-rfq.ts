import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import saveRFQ from '@framework/b2b/request-for-quote/save-rfq'

const saveRFQApiMiddleware = async (req: any, res: any) => {
    const { data }: any = req?.body
  try {
    const response = await saveRFQ()(data, req?.cookies)

    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(saveRFQApiMiddleware)
