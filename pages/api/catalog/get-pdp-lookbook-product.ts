import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetPdpLookbookProductApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpLookbookProduct({
      query: req.body.slug,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetPdpLookbookProductApiMiddleware
