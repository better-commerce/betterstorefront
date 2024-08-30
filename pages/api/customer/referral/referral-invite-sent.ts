import { useReferralInviteSent } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'

const referralInviteSentApiMiddleware = async (req: any, res: any) => {
  const { referralId }: any = req.body
  try {
    const response: any = await useReferralInviteSent()(referralId, req?.cookies)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(referralInviteSentApiMiddleware)
