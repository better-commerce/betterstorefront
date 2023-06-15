import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetReturnReasonApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getReturnReason({
      query: req.body,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetReturnReasonApiMiddleware;