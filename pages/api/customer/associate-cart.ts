import { associateCart } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const AssociateCartApiMiddleware = async (req: any, res: any) => {
  const { basketId, userId }: any = req.body.data
  try {
    const response = await associateCart()({
      basketId,
      userId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default AssociateCartApiMiddleware;