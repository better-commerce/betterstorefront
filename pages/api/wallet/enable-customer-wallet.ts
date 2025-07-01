import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import enableCustomerWalletById from '@framework/wallet/enable-customer-wallet'

const enableCustomerWalletApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const response: any = await enableCustomerWalletById(req.body, req?.cookies)
    //console.log({ response })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(enableCustomerWalletApiMiddleware)
