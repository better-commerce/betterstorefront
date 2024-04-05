import useClickCollectStore from '@framework/delivery/use-click-collect-store'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

async function clickCollectStoreApiMiddleware(req: any, res: any) {
    const { basketId, deliveryMethodId, store }: any = req.body
    try {
        const response = await useClickCollectStore()({ basketId, deliveryMethodId, store, cookies: req.cookies, })
        res.status(200).json(response)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(clickCollectStoreApiMiddleware)
