import { useReferralByEmail } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ReferralByEmailApiMiddleware = async (req: any, res: any) => {
  const { email }: any = req.body
  try {
    const response: any = await useReferralByEmail()(email)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ReferralByEmailApiMiddleware;