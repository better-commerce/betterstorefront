import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import createBankDetails from '@framework/wallet/customer-bank/create'

async function createBankDetailsApiMiddleware(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const { data } = await createBankDetails(req.body, req.cookies)
    res.status(200).json(data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(createBankDetailsApiMiddleware)