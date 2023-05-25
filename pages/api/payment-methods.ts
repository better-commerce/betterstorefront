import { getPaymentMethods } from '@framework/payment'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetPaymentMethodsapiMiddleware =  async (req: any, res: any) => {
  const { countryCode, currencyCode }: any = req.body
  try {
    const response = await getPaymentMethods()({
      countryCode,
      currencyCode,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetPaymentMethodsapiMiddleware;