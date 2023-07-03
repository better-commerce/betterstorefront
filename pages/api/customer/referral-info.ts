import { useReferralInfo } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ReferralInfoApiMiddleware = async (req: any, res: any) => {
  try {
    const response: any = await useReferralInfo()
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ReferralInfoApiMiddleware;