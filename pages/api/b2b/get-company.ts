import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import useCompanyDetails from '@framework/b2b/get-company'

const getCompanyApiMiddleware = async (req: any, res: any) => {
  const { userId }: any = req?.body
  try {
    const response = await useCompanyDetails()(userId, req?.cookies)

    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCompanyApiMiddleware)
