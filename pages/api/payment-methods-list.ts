import { getPaymentMethods } from '@framework/payment'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import { decipherPayload } from '@framework/utils/app-util'
import { encrypt } from '@framework/utils/cipher'

const getPaymentMethodsListApiMiddleware = async (req: any, res: any) => {
    try {
        const data = decipherPayload(Object.keys(req.body)[0])
        const { countryCode, currencyCode, basketId }: any = data
        const response = await getPaymentMethods()({
            countryCode,
            currencyCode,
            basketId,
            cookies: req?.cookies,
        })
        res.status(200).json(encrypt(JSON.stringify(response)))
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(getPaymentMethodsListApiMiddleware)
