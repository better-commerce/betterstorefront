import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import useGetEngageCampaignData from '@framework/api/endpoints/engage-campaign/get-campaings-by-event'

async function productCampaignsApiMiddleware(req: any, res: any) {
  const { type, guid }: any = req.body
  try {
    const response = await useGetEngageCampaignData(req, {
      type,
      guid,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(productCampaignsApiMiddleware)
