import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getLoanDetails from '@framework/loan-calculator/get-loan-details';

const getLoanDetailsApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') { 
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { rateCardProductId, deposit, price } = req?.body

  try {
    const response: any = await getLoanDetails(rateCardProductId, deposit, price, req?.cookies)
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getLoanDetailsApiMiddleware);
