import getCollectionBySlug from '@framework/api/content/getCollectionBySlug';
import commerce from '@lib/api/commerce'

const GetCollectionApiMiddleware = async (req: any, res: any) => {
  try {
    let response: any;
    const currentPage = req?.body?.currentPage || 1;
    const filters = req?.body?.filters || [];

    // Changes for API calls optimizations.
    // Call "/slug-minimal" API20 endpoint for loading product collections with first page-set and empty filters.
    if (req?.body?.slug && currentPage == 1 && filters?.length == 0) {
      response = await getCollectionBySlug(req?.body?.slug, req?.cookies);
    } else {
      response = await commerce.getAllProducts({
        query: req.body,
        cookies: req.cookies,
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export default GetCollectionApiMiddleware;