import { mergeCart } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const MergeCartApiMiddleware = async (req: any, res: any) => {
  const { userBasketId, currentBasketId }: any = req.body.data
  try {
    const response = await mergeCart()({
      userBasketId,
      currentBasketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default MergeCartApiMiddleware;