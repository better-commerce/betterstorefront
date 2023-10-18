import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

const getCountriesApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getCountries({
      query: req.body,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getCountriesApiMiddleware)
