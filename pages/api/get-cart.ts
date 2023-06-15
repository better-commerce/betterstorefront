import { useCart } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetCartApiMiddleware = async (req: any, res: any) => {
  const { basketId }: any = req.query
  try {
    const response = await useCart()({
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetCartApiMiddleware;