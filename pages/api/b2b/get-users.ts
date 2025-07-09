import { useB2BCompanyUsers } from '@framework/b2b'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const getCompanyUsersApiMiddleware = async (req: any, res: any) => {
  const { companyId }: any = req?.body
  try {
    const response = await useB2BCompanyUsers()(companyId, req?.cookies)
    res
      .status(200)
      .json(
        response?.result?.length
          ? response?.result?.map(getUserDetailTransform)
          : []
      )
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCompanyUsersApiMiddleware)

export const getUserDetailTransform = (user: any) => ({
  birthDate: user?.birthDate,
  dayOfBirth: user?.dayOfBirth,
  monthOfBirth: user?.monthOfBirth,
  yearOfBirth: user?.yearOfBirth,
  walletId: user?.walletId,
  userId: user?.userId,
  firstName: user?.firstName,
  lastName: user?.lastName,
  title: user?.title,
  phoneNo: user?.phoneNo,
  gender: user?.gender,
  telephone: user?.telephone,
  username: user?.username,
  email: user?.email,
  companyName: user?.companyName,
  companyId: user?.companyId,
  companyUserRole: user?.companyUserRole,
  defaultPaymentMethod: user?.defaultPaymentMethod,
  address: user?.address,
  location: user?.location,
  businessUnit: user?.businessUnit,
  authorizedSpendLimit: user?.authorizedSpendLimit,
  canApproveOrder: user?.canApproveOrder,
  reportingManager: user?.reportingManager,
  canPlaceOrder: user?.canPlaceOrder,
  canSeeInvoices: user?.canSeeInvoices,
  canSeeCreditLimit: user?.canSeeCreditLimit,
  team: user?.team,
  spendLimit: user?.spendLimit,
  notifyByEmail: user?.notifyByEmail,
  notifyBySMS: user?.notifyBySMS,
  notifyByPost: user?.notifyByPost,
  isWelcomeEmailSent: user?.isWelcomeEmailSent,
  hasMembership: user?.hasMembership,
  hasSubscribed: user?.hasSubscribed,
  hasSubscription: user?.hasSubscription,
  newsLetterSubscribed: user?.newsLetterSubscribed,
  id: user?.id,
  recordId: user?.recordId,
  externalStatus: user?.externalStatus,
})
