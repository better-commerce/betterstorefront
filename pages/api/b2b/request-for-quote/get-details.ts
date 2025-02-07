import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import getDetails from '@framework/b2b/request-for-quote/get-details'

const getRFQDetailsApiMiddleware = async (req: any, res: any) => {
    const { rfqId }: any = req?.body
  try {
    const response = await getDetails()(rfqId ,req?.cookies)
    res.status(200).json(response?.result) 
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getRFQDetailsApiMiddleware)
