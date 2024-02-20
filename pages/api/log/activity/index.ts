import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import { decipherPayload, logActivityRequest } from '@framework/utils/app-util'

async function activityLogApiMiddleware(req: any, res: any) {
    let data = req?.body
    try {
        data = decipherPayload(Object.keys(data)[0])
        const { message, logData, pageUrl, objectId, userId, userName, ipAddress } = data
        const response = await logActivityRequest({
            //headers: {},
            data: logData,
            cookies: req?.cookies,
            pageUrl,
            objectId,
            userId,
            userName,
            ipAddress,
        }, message)
        res.status(200).json(response)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(activityLogApiMiddleware)
