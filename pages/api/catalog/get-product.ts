import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetProductApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getProduct({
      query: req.body.slug,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetProductApiMiddleware;