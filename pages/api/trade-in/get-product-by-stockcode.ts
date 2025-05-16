import { apiMiddlewareErrorHandler } from "@framework/utils";
import apiRouteGuard from "../base/api-route-guard";
import getTradeInProductByStockCode from "@framework/trade-in/get-product-by-stockcode";

const getTradeInProductsapiMiddleware = async (req: any, res: any) => {
  try {
    const response = await getTradeInProductByStockCode(req.body?.stockcode, req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};
export default apiRouteGuard(getTradeInProductsapiMiddleware)
