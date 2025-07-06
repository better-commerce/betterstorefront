import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { EmptyString } from '@components/utils/constants'
import getAllUsed from '@framework/used/get-all-used'
import { getProductListTransform } from './products'

const getCollectionApiMiddleware = async (req: any, res: any) => {
  try {
    const { currentPage = 1, pageSize = 40 } = req.body || {}

    const response = await commerce.getAllUsed({
      currentPage,
      pageSize,
      cookies: req.cookies,
    })

    const transformed = {
      ...response,
      products: {
        ...response?.products,
        results: response?.products?.results?.length
          ? getProductListTransform(response.products.results)
          : [],
      },
    }

    res.status(200).json(transformed)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCollectionApiMiddleware)
