import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import getProductRateList from '@framework/loan-calculator/get-product-rates';

const getProductRatesApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'GET') { 
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const interestFree = req?.query?.interestFree || "false"

  try {
    const [retailerRateCardProducts]: any = await getProductRateList(req?.cookies);
    const containingText = (interestFree === "true") ? "interest free" : "interest bearing"
    res.status(200).json(retailerRateCardProducts?.RetailerRateCardProducts?.filter((x: any) => x?.FullName?.toLowerCase()?.includes(containingText.toLowerCase())));
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(getProductRatesApiMiddleware);
