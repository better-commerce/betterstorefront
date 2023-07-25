import searchProducts from '@framework/api/operations/search-product'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const searchProductsApiMiddleware = async (req: any, res: any) => {
  const { value }: any = req.body
  try {
    const response = await searchProducts()({
      value,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(searchProductsApiMiddleware)
