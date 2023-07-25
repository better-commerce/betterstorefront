import { useReferralVouchers } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'

const referralVouchersApiMiddleware = async (req: any, res: any) => {
  const { userId }: any = req.body
  try {
    const response: any = await useReferralVouchers()(userId)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(referralVouchersApiMiddleware)
