import { useReferralSearch } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ReferralSearchApiMiddleware = async (req: any, res: any) => {
  const { name,email }: any = req.body
  try {
    const response: any = await useReferralSearch()(name,email)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ReferralSearchApiMiddleware;