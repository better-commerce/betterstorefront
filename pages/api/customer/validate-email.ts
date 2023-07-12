import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const ValidateEmailApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.validateEmail({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default ValidateEmailApiMiddleware
