import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components/utils/constants'
import { mapObject } from '@framework/utils/translate-util'
import { getProductListTransform } from 'pages/api/catalog/products'
/**
 * Fetches a collection by its slug.
 * @param {string} slug - The collection slug.
 * @param {object} [cookies] - The cookies to send with the request.
 * @returns {Promise} A promise that resolves to the collection or an error.
 */

/**
 * Fetches a collection by its slug.
 * @param {string} slug - The slug of the collection to fetch.
 * @param {object} [cookies] - Optional cookies to include in the request.
 * @returns {Promise<object>} A promise that resolves to the collection data or an error.
 */

export default function getCollectionBySlug(slug: string, cookies?: any) {

  /**
   * Fetches a collection by its slug with minimal information.
   * @returns {Promise} A promise that resolves to the collection or an error.
   */
  async function getCollectionBySlugAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + `/slug-minimal/?slug=${slug}`,
        method: 'get',
        cookies,
      })
      //return { ...response.result, ...{ snippets: response?.snippets ?? [] }, ...{ status: response?.status }, }
      return { ...response?.result, products: { ...response?.result?.products, results: mapObject(response, getCollectionBySlugTransformMap)?.data, }, ...{ snippets: response?.snippets ?? [] }, ...{ status: response?.status } }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionBySlugAsync()
}

const getCollectionBySlugTransformMap = {

  data: (response: any) => ([
    ...response?.result?.products?.results?.length ? getProductListTransform(response?.result?.products?.results) : new Array<any>(),
  ]),
}

export const getCollectionHeroBannerTransform = {
  data: (result: any) => ({
    images: result?.images,
  })
}

export const getCollectionOfferBannerCollectionTransform = {
  data: (result: any) => [
    ...result?.length ? result?.map((x: any) => ({ title: x?.title, description: x?.description, url: x?.url, image: x?.image, link: x?.link, buttonText: x?.buttonText })) : new Array<any>()
  ]
}

export const getProductCollectionTransformMap = {

  data: (results: any) => ([
    ...results?.length ? getProductListTransform(results) : new Array<any>(),
  ])
}