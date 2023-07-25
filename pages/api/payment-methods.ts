import { getPaymentMethods } from '@framework/payment'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getPaymentMethodsapiMiddleware = async (req: any, res: any) => {
  const { countryCode, currencyCode, basketId }: any = req.body
  try {
    const response = await getPaymentMethods()({
      countryCode,
      currencyCode,
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getPaymentMethodsapiMiddleware)
