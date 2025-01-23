import searchProducts from '@framework/api/operations/search-product'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import { mapObject } from '@framework/utils/translate-util'
import apiRouteGuard from '../base/api-route-guard'
import { getProductListTransform } from './products'

/**
 * API route to search products.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 */

const searchProductsApiMiddleware = async (req: any, res: any) => {
  const { value, sortBy }: any = req.body
  try {
    const response = await searchProducts()({
      value,
      sortBy,
      cookies: req?.cookies,
    })
    res.status(200).json(mapObject(response, getSearchProductsTransformMap)?.data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

const getSearchProductsTransformMap = {
  
  /**
   * Maps the API response to include only the necessary product data.
   *
   * @param {Object} response - The API response object containing search results.
   * @returns {Object} - An object with the transformed search results.
   */
  data: (response: any) => ({
    ...response,
    results: response?.results?.length ? getProductListTransform(response?.results) : new Array<any>(),
  })
}

export default apiRouteGuard(searchProductsApiMiddleware)
