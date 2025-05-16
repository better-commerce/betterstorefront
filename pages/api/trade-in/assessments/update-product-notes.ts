import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import updateProductNotes from '@framework/trade-in/assessments/update-product-notes'

const updateProductNotesApiMiddleware = async (req: any, res: any) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!req.body.notes) {
    return res.status(400).json({ error: 'Missing notes!' })
  }

  try {
    const response = await updateProductNotes(req?.body?.id ,req?.body?.notes, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateProductNotesApiMiddleware)