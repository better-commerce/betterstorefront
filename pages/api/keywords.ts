import useKeywords from '@framework/api/endpoints/keywords'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  try {
    const response = await useKeywords(req.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
