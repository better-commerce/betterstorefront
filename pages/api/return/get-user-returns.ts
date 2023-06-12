import getReturns from '@framework/return/get-user-returns'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function getUserReturns(req: any, res: any) {
  try {
    const response = await getReturns(req.body.userId, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
