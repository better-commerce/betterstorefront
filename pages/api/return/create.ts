import createReturn from '@framework/return/create'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function createReturnEndpoint(req: any, res: any) {
  try {
    const response = await createReturn(req.body.model, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
