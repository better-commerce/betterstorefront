import useCreateCart from '@framework/cart/use-create-cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

async function createCartApiMiddleware(req: any, res: any) {
    const { basketId, basketName, userId }: any = req.body
    try {
        const response = await useCreateCart()({
            basketId,
            basketName,
            userId,
            cookies: req.cookies,
        })
        res.status(200).json(response?.result)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
}

export default apiRouteGuard(createCartApiMiddleware)
