import { getAltRelatedProducts } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const getAltRelatedProductsApiMiddleware = async (req: any, res: any) => {
  const { slug }: any = req.body
  try {
    const response: any = await getAltRelatedProducts()(slug, req?.cookies)
    res.status(200).json({ relatedProducts: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getAltRelatedProductsApiMiddleware)
