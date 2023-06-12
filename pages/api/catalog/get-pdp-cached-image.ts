import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetPDPCachedImagesApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpCachedImage({
      query: req.body.productCode,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetPDPCachedImagesApiMiddleware;