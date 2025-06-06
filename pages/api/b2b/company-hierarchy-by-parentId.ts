import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import useCompanyHierarchyByParentId from '@framework/b2b/get-company-hierarchy-by-parentId'

const getCompanyHierarchyByParentIdApiMiddleware = async (req: any, res: any) => {
  const { companyId, parentId }: any = req?.body
  try {
    const response = await useCompanyHierarchyByParentId()(companyId, parentId, req?.cookies)
    res.status(200).json(response?.data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCompanyHierarchyByParentIdApiMiddleware)
