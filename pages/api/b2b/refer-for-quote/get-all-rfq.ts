import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import getAllRFQ from '@framework/b2b/refer-for-quote/get-all-rfq'

// Function to format date in ISO 8601 format
const getAllRFQApiMiddleware = async (req: any, res: any) => {
    const { data }: any = req?.body
    const payload = {
      "companyName" : data?.companyName,
      "companyId" : data?.companyId,
      "email" : data?.email,
      "fromDate": data?.fromDate ,
      "toDate": data?.toDate,
      }
  try {
    const response = await getAllRFQ()(payload , data?.currentPage, data?.pageSize , req?.cookies)

    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getAllRFQApiMiddleware)
