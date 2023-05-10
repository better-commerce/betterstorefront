import useBasketValidate from '@framework/cart/use-basket-validate';

export default async function (req: any, res: any) {
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
        res.status(500).json({ error })
    }
};