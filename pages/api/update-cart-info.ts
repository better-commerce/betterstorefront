import { useUpdateCartInfo } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function updateCartInfoApiMiddleware(req: any, res: any) {
  const { basketId, info, lineInfo }: any = req.body
  try {
    const response = await useUpdateCartInfo()({
      basketId,
      info,
      lineInfo,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateCartInfoApiMiddleware)
