import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getCustomerDetails from '@framework/trade-in/get-customer-details';

const getCustomerDetailsApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!req.query?.customerId) {
    return res.status(400).json({ error: 'Missing customer ID' });
  }

  try {
    const response = await getCustomerDetails(req.query?.customerId)
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getCustomerDetailsApiMiddleware);
