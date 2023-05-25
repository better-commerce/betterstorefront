import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const DeleteAddressApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.deleteAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default DeleteAddressApiMiddleware;