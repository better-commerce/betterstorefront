import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const RemoveItemFromWishlistApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.removeItemFromWishlist({
      query: req.body,
      cookie: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default RemoveItemFromWishlistApiMiddleware;