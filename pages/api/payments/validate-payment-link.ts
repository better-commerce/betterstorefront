import useValidatePaymentLink from '@framework/api/endpoints/payments/validate-payment-link'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  const link = req?.body?.data
  try {
    const response = await useValidatePaymentLink({
      link,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
