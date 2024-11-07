import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import downloadPdf from '@framework/pdf/download-pdf'

async function downloadPdfMiddleware(req: any, res: any) {
  try {
    const response = await downloadPdf()({
      data: req?.body,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(downloadPdfMiddleware)
