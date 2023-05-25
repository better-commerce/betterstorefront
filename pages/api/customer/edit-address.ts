import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const EditAddressApiMiddleware = async (req: any, res: any) => {
  try {
    console.group(req.body, 'req body')
    const response = await commerce.editAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default EditAddressApiMiddleware;