import { useForgotPassword } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function ForgotPassword(req: any, res: any) {
  const { email } = req.body
  const response = await useForgotPassword(email, req.cookies)
  res.status(200).json(response)
  try {
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
