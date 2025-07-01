import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import associateWalletToCustomer from '@framework/wallet/associate-customer-wallet'

const associateWalletToCustomerApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
const { id, walletId } = req.body;
    const response: any = await associateWalletToCustomer(id, walletId, req?.cookies)
    //console.log({ response })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(associateWalletToCustomerApiMiddleware)
