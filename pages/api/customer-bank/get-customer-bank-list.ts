import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getCustomerBankListById from '@framework/customer-bank/get-customer-bank-list';

const getCustomerBankByIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') { 
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { walletId, page, pageSize } = req.body;
    if (!walletId) {
      return res.status(400).json({ error: 'Wallet ID is required' });
    }

    const response: any = await getCustomerBankListById(walletId, { page, pageSize }, req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getCustomerBankByIdApiMiddleware);
