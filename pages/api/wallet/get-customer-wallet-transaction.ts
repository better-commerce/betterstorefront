import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getCustomerWalletTransactionById from '@framework/wallet/get-customer-wallet-transaction';

const getCustomerWalletTransactionByIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') { 
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { walletId, page, pageSize, sortBy, sortDescending, filters } = req.body; // Extract request params
    if (!walletId) {
      return res.status(400).json({ error: 'Wallet ID is required' });
    }

    // Pass walletId separately and pagination data in the request body
    const response: any = await getCustomerWalletTransactionById(walletId, { page, pageSize, sortBy, sortDescending, filters }, req?.cookies);
    
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getCustomerWalletTransactionByIdApiMiddleware);
