import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getCustomerWalletBalanceById from '@framework/wallet/get-balance';

const getCustomerWalletBalanceApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {  // Change from GET to POST
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { walletId } = req.body; // Get walletId from request body
    if (!walletId) {
      return res.status(400).json({ error: 'Wallet ID is required' });
    }

    const response: any = await getCustomerWalletBalanceById(walletId, req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getCustomerWalletBalanceApiMiddleware);
