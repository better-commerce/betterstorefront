import { updateShipping } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const UpdateShippingApiMiddleware = async (req: any, res: any) => {
  const { basketId, countryCode, shippingId }: any = req.body
  try {
    const response = await updateShipping()({
      basketId,
      countryCode,
      shippingId,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default UpdateShippingApiMiddleware;