import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getProductRateList from '@framework/loan-calculator/get-product-rates';

const getProductRatesApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'GET') { 
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response: any = await getProductRateList(req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getProductRatesApiMiddleware);
