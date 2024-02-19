import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'
import { decipherPayload, logPaymentRequest } from '@framework/utils/app-util'

async function paymentLogApiMiddleware(req: any, res: any) {
    let data = req?.body
    try {
        data = decipherPayload(Object.keys(data)[0])
        const { message, paymentGatewayId, logData, pageUrl, objectId, userId, userName } = data
        const response = await logPaymentRequest({
            //headers: {},
            paymentGatewayId,
            data: logData,
            cookies: req?.cookies,
            pageUrl,
            objectId,
            userId,
            userName,
        }, message)
        res.status(200).json(response)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(paymentLogApiMiddleware)
