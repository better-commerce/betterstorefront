import { apiMiddlewareErrorHandler } from '@framework/utils';
import apiRouteGuard from '../base/api-route-guard';
import saveQuoteByItemId from '@framework/trade-in/set-line-level-status';

const saveQuoteByItemIdApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, itemId, status, rejectionReason } = req.body // Extract all fields

  if (!id || !itemId) {
    return res.status(400).json({ error: 'Missing quote ID or item ID' });
  }

  try {
    const response = await saveQuoteByItemId(id, itemId, status, rejectionReason, req?.cookies);
    res.status(200).json(response);
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error);
  }
};

export default apiRouteGuard(saveQuoteByItemIdApiMiddleware);
