import useBasketValidate from '@framework/cart/use-basket-validate';
import { apiMiddlewareErrorHandler } from '@framework/utils'

const BasketValidateApiMiddleware = async function (req: any, res: any) {
    const {
        basketId,
    }: any = req?.body
    try {
        const response = await useBasketValidate()({
            basketId,
            cookies: req?.cookies
        });
        res.status(200).json(response)
    } catch (error) {
        apiMiddlewareErrorHandler(req, res, error)
    }
};

export default BasketValidateApiMiddleware;