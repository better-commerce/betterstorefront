import { updateAddress } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const UpdateAddressApiMiddleware = async (req: any, res: any) => {
  const { basketId, model }: any = req.body
  try {
    const response = await updateAddress()({
      basketId,
      model,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default UpdateAddressApiMiddleware;