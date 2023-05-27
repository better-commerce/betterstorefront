import usePaypal from "framework/bettercommerce/api/endpoints/payments/paypal";

export default async (req: any, res: any) => {
    try {
        let referer;
        let origin: string = req?.headers?.referer;
        if (origin) {
            if (origin.startsWith("http://")) {
                referer = origin.replace("http://", "");
            } else if (origin.startsWith("https://")) {
                referer = origin.replace("https://", "");
            }

            referer = referer?.substring(0, referer?.indexOf("/"));
            referer = `${origin.startsWith("https://") ? "https" : "http"}://${referer}`;
            if (referer.endsWith("/")) {
                referer = referer.substring(0, referer.length - 1);
            }
        }
        const response = await usePaypal({ data: req.body, params: req.query, cookies: req.cookies, origin: referer })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error })
    }
}