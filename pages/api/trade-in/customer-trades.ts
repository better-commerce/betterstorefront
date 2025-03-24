import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getCustomerTrades from '@framework/trade-in/get-customer-trades';

const getCustomerTradesApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const response = await getCustomerTrades(req?.cookies)
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getCustomerTradesApiMiddleware);
