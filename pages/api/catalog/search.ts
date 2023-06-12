import searchProducts from '@framework/api/operations/search-product'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const SearchProductsApiMiddleware = async (req: any, res: any) => {
  const { value }: any = req.body
  try {
    const response = await searchProducts()({
      value,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default SearchProductsApiMiddleware;