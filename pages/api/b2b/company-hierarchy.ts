import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import useCompanyHierarchy from '@framework/b2b/get-company-hierarchy'

const getCompanyHierarchyApiMiddleware = async (req: any, res: any) => {
  const { companyId }: any = req?.body
  try {
    const response = await useCompanyHierarchy()(companyId, req?.cookies)
    res.status(200).json(response?.data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCompanyHierarchyApiMiddleware)
