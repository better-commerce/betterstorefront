import { useB2BCompanyUsers } from '@framework/b2b'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const getCompanyUsersApiMiddleware = async (req: any, res: any) => {
  const { companyId }: any = req?.body
  try {
    const response = await useB2BCompanyUsers()(companyId, req?.cookies)
    res.status(200).json(response?.result?.length ? response?.result?.map(getUserDetailTransform) : [])
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCompanyUsersApiMiddleware)

export const getUserDetailTransform = (user: any) => ({
  userId: user?.userId,
  firstName: user?.firstName,
  lastName: user?.lastName,
  title: user?.title,
  phoneNo: user?.phoneNo,
  gender: user?.gender,
  telephone: user?.telephone,
  username: user?.username,
  email: user?.email,
  companyId: user?.companyId,
  address: user?.address,
  companyUserRole: user?.companyUserRole,
  notifyByEmail: user?.notifyByEmail,
  notifyBySMS: user?.notifyBySMS,
  notifyByPost: user?.notifyByPost,
  isWelcomeEmailSent: user?.isWelcomeEmailSent,
  id: user?.id,
  recordId: user?.recordId,
  externalStatus: user?.externalStatus
})