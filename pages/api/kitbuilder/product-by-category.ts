import { productByCategoryBrandPlatform } from '@framework/api/endpoints/kitbuilder'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function productByCategoryApiMiddleware(req: any, res: any) {
  try {
    const {
      brandId,
      platformId,
      TierId,
      kitCategoryId,
      includeOutOfStockItems,
      productApplication,
    } = req.body
    const response = await productByCategoryBrandPlatform({
      query: {
        brandId,
        platformId,
        TierId,
        kitCategoryId,
        includeOutOfStockItems,
        productApplication,
      },
      cookies: req?.cookies,
    })
    res.status(200).json(response || [])
  } catch (error) {
    console.log(error)
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(productByCategoryApiMiddleware)
