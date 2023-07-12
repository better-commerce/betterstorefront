import useInfra from '@framework/api/endpoints/infra'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  const { setHeader = false } = req.body
  try {
    const response = await useInfra(req)(setHeader)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
