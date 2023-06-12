import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const CreateReviewApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.createReview(req.body, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default CreateReviewApiMiddleware;