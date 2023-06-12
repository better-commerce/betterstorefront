import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const PriceMatchApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.priceMatch(
      {
        data: req.body,
      },
      req.cookies
    )
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default PriceMatchApiMiddleware;