import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetCollectionApiMiddleware = async (req: any, res: any) => {
  try {
    let response: any
    const { slug, isCategory = false } = req?.body
    const currentPage = req?.body?.currentPage || 1
    const filters = req?.body?.filters || []
    const sortBy = req?.body?.sortBy

    // Changes for API calls optimizations.
    // Call "/slug-minimal" API20 endpoint for loading product collections with first page-set and empty filters.
    if (!isCategory && slug && currentPage == 1 && filters?.length == 0 && sortBy == 0) {
      response = await getCollectionBySlug(slug, req?.cookies)
    } else {
      response = await commerce.getAllProducts({
        query: req.body,
        cookies: req.cookies,
      })
    }
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default GetCollectionApiMiddleware
