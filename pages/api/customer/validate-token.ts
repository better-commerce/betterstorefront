import { useValidateToken } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function ValidateToken(req: any, res: any) {
  try {
    const response = await useValidateToken(req.body.token, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
