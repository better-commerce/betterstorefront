import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import sendNotes from '@framework/b2b/send-notes'

const sendNotesApiMiddleware = async (req: any, res: any) => {
  const { data }: any = req?.body
  const payload = {
    objectId: data?.objectId,
    noteText: data?.noteText,
    recordId: data?.recordId,
    noteType: data?.noteType
  }
  try {
    const response = await sendNotes()(payload, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(sendNotesApiMiddleware)
