import { useBulkAdd } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const BulkAddCartApiMiddleware = async (req: any, res: any) => {
  const { basketId, products }: any = req.body
  try {
    const response = await useBulkAdd()({
      basketId,
      products,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default BulkAddCartApiMiddleware;