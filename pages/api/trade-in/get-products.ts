import getTradeInProducts from "@framework/trade-in/get-products";
import { apiMiddlewareErrorHandler } from "@framework/utils";
import apiRouteGuard from "../base/api-route-guard";

const getTradeInProductsapiMiddleware = async (req: any, res: any) => {
  try {
    const response = await getTradeInProducts(req.body?.searchText, req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};
export default apiRouteGuard(getTradeInProductsapiMiddleware)
