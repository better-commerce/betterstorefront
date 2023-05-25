import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetWishlistApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getWishlist({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetWishlistApiMiddleware;