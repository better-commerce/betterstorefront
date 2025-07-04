import useSlugResolver from "@framework/use-slug-resolver";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;

    if (typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid path parameter' });
    }

    try {
        const slugType = await useSlugResolver()({ slug, cookies: req.cookies })
        if (slugType) {
            return res.status(200).json({ found: true, slugType, message: 'Matching handler found' });
        }

        return res.status(200).json({ found: false, slugType, message: 'No matching handler found' });
    } catch (error) {
        console.error('Database query failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}