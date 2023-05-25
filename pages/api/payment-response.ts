import { putPaymentResponse } from '@framework/payment'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const PaymentResponseApiMiddleware = async (req: any, res: any) => {
  const { orderId, model }: any = req.body
  try {
    const response = await putPaymentResponse()({
      orderId,
      model,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default PaymentResponseApiMiddleware;