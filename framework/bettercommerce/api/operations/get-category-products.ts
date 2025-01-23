import fetcher from '../../fetcher'
import { SEARCH_ADVANCED_ENDPOINT } from '@components/utils/constants'
import { getProductListTransform } from 'pages/api/catalog/products';

/**
 * Get category products.
 *
 * @param {string} categoryId - Category ID.
 * @param {Object} [cookies] - Cookies object.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the category products.
 */
export default async function getCategoryProducts(
  categoryId: string,
  cookies?: any
) {
  try {
    const response: any = await fetcher({
      url: SEARCH_ADVANCED_ENDPOINT,
      method: 'post',
      data: { categoryId },
      cookies,
    })
    return { ...response.result, ...{ snippets: response?.snippets } };
    //return mapObject(response, getCategoryBySlugTransformMap)?.data
  } catch (error: any) {
    throw new Error(error)
  }
}

const getCategoryBySlugTransformMap = {

  data: (response: any) => ({
    ...response.result,
    ...{ snippets: response?.snippets ?? [] },
    ...{ status: response?.status },
    results: response.result?.results?.length ? getProductListTransform(response.result?.results) : new Array<any>(),
  })
}