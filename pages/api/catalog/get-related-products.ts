import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { mapObject } from '@framework/utils/translate-util'
import { getRelatedProductsTransformMap } from './products'

/**
 * API route to get related products.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 */
const getRelatedProductsApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getRelatedProducts({
      query: req.body.recordId,
      cookies: req?.cookies,
    })
    res.status(200).json({ relatedProducts: mapObject(response?.relatedProducts || [], getRelatedProductsTransformMap)?.data })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getRelatedProductsApiMiddleware)
