import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import commerce from '@lib/api/commerce'

async function getPagePreviewContentApiMiddleware(req: any, res: any) {
  const { id, workingVersion, slug, channel, currency }: any = req.query
  try {
    const response = await commerce.getPagePreviewContent({
      id,
      slug,
      workingVersion,
      channel,
      currency,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getPagePreviewContentApiMiddleware)
