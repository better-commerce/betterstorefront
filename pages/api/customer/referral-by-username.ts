import { useReferralByUsername } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ReferralByUsernameApiMiddleware = async (req: any, res: any) => {
  const { username }: any = req.body
  try {
    const response: any = await useReferralByUsername()(username)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ReferralByUsernameApiMiddleware;