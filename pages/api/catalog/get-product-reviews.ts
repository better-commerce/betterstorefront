import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetProductReviewApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getProductReview({
      query: req.body.recordId,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetProductReviewApiMiddleware;