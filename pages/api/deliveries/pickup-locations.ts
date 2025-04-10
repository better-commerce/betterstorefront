import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import usePickupLocations from '@framework/deliveries/use-pickup-locations'

async function pickupLocationsApiMiddleware(req: any, res: any) {
    const { currentPage, pageSize, postCode }: any = req.body
    try {
        const response = await usePickupLocations()({ currentPage, pageSize, postCode, cookies: req.cookies, })
        res.status(200).json(response)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(pickupLocationsApiMiddleware)
