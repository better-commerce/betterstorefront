import { confirmOrder } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ConfirmOrderApiMiddleware = async (req: any, res: any) => {
  const { basketId, model }: any = req.body
  try {
    const response = await confirmOrder()({
      basketId,
      model,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default ConfirmOrderApiMiddleware;