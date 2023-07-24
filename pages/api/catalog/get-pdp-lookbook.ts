import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetPDPLookbookApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpLookbook({
      query: req.body.stockCode,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetPDPLookbookApiMiddleware
