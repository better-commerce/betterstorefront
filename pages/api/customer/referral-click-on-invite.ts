import { useReferralClickOnInvite } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ReferralClickOnInviteApiMiddleware = async (req: any, res: any) => {
  const { referralId}: any = req.body
  try {
    const response: any = await useReferralClickOnInvite()(referralId)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ReferralClickOnInviteApiMiddleware;