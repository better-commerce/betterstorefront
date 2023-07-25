import { useReferralBySlug } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'

const referralBySlugApiMiddleware = async (req: any, res: any) => {
  const { slug }: any = req.body
  try {
    const response: any = await useReferralBySlug()(slug)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(referralBySlugApiMiddleware)
