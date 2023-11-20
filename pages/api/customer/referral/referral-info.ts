import { useReferralInfo } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'

const referralInfoApiMiddleware = async (req: any, res: any) => {
  try {
    const response: any = await useReferralInfo()
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(referralInfoApiMiddleware)
