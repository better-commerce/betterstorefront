import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { mapObject } from '@framework/utils/translate-util'
import { EmptyString } from '@components/utils/constants'

/**
 * API route to get a product collection by slug.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 */

const getCollectionApiMiddleware = async (req: any, res: any) => {
  try {
    let response: any
    // const { slug, isCategory = false } = req?.body
    // const currentPage = req?.body?.currentPage || 1
    // const filters = req?.body?.filters || []
    // const sortBy = req?.body?.sortBy

    // Changes for API calls optimizations.
    // Call "/slug-minimal" API20 endpoint for loading product collections with first page-set and empty filters.
    /*if (
      !isCategory &&
      slug &&
      currentPage == 1 &&
      filters?.length == 0 &&
      sortBy == 0
    ) {
      response = await getCollectionBySlug(slug, req?.cookies)
    } else {*/
    response = await commerce.getAllProducts({
      query: req.body,
      cookies: req.cookies,
    })
    //}
    res.status(200).json(mapObject(response, getAllProductsTransformMap)?.data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

/**
 * Maps a product object to only include the properties that are needed
 * for the product grid/list. This is to reduce the payload size and only
 * include the properties that are needed for the product grid/list.
 *
 * @param {Object} product - The product object to be mapped.
 * @returns {Object} - The mapped product object.
 */
export const getProductListTransform = (results: any) => results?.map((product: any) => ({
  recordId: product?.recordId,
  name: product?.name,
  slug: product?.slug,
  stockCode: product?.stockCode,
  listPrice: product?.listPrice,
  price: product?.price,
  images: product?.images?.length ? product?.images?.map((image: any) => ({ name: image?.name, tag: image?.tag, url: image?.url, alt: image?.alt, displayOrder: image?.displayOrder, isActive: image?.isActive })) : new Array<any>(),
  image: product?.image,
  itemType: product?.itemType,
  shortDescription: product?.shortDescription,
  groupName: product?.groupName,
  relatedType: product?.relatedType,
  brand: product?.brand,
  brandSlug: product?.brandSlug,
  subBrand: product?.subBrand,
  sku: product?.sku,
  classification: product?.classification,
  currentStock: product?.currentStock,
  description: product?.description,
  attributes: product?.attributes,
  fulfilFromWarehouse: product?.fulfilFromWarehouse,
  //fulfilFromStore: product?.fulfilFromStore,
  fulfilFromSupplier: product?.fulfilFromSupplier,
  trending: product?.trending,
  bestSeller: product?.bestSeller,
  onSale: product?.onSale,
  newLaunch: product?.newLaunch,
  exclusive: product?.exclusive,
  variantProductsMinimal: product?.variantProductsMinimal,
  variantProductsAttributeMinimal: product?.variantProductsAttributeMinimal,
  promotions: product?.promotions,
  preOrder: product?.preOrder,
  rating: product?.rating,
  reviewCount: product?.reviewCount,
  groupNameList: product?.groupNameList,
  variantGroupCode: product?.variantGroupCode,
  fulfilFromWarehouseDays: product?.fulfilFromWarehouseDays,
  fulfilFromSupplierDays: product?.fulfilFromSupplierDays,
  //fulfilFromInstoreDays: product?.fulfilFromInstoreDays,
  flags: product?.flags,
  productId: product?.productId || EmptyString,
}))

const getAllProductsTransformMap = {

  /**
   * Transforms the API response to include only the necessary product data.
   *
   * @param {Object} response - The API response object containing product details.
   * @returns {Object} - An object with the transformed product data.
   */
  data: (response: any) => ({
    ...response,
    products: {
      ...response?.products,
      results: response?.products?.results?.length ? getProductListTransform(response?.products?.results) : new Array<any>(),
    },
  })
}

export const getRelatedProductsTransformMap = {
  data: (results: any) => results?.length ? getProductListTransform(results) : new Array<any>()
}

export default apiRouteGuard(getCollectionApiMiddleware)
