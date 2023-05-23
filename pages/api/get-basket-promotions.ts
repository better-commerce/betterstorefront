import useGetBasketPromotions from '@framework/cart/use-get-basket-promotions';

const GetBasketPromotionsApiMiddleware = async (req: any, res: any) => {
    const { basketId }: any = req.query;
    try {
        const response = await useGetBasketPromotions()({
            basketId,
            cookies: req.cookies,
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default GetBasketPromotionsApiMiddleware;