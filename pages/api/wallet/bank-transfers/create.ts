import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import createBankTransfer from '@framework/wallet/bank-transfer/create-bank-transfer'

async function createBankTransferApiMiddleware(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const { data } = await createBankTransfer(req.body, req.cookies)
    res.status(200).json(data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(createBankTransferApiMiddleware)
