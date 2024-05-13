import useReturnOrderLine from '@framework/checkout/return-order-line';

export default async function (req: any, res: any) {
    try {
        const response = await useReturnOrderLine()({
            data: req?.body,
            cookies: req?.cookies
        });
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error })
    }
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '60mb',
        },
    },
}