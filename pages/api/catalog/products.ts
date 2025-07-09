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
export const getProductListTransform = (results: any) =>
  results?.map((product: any) => ({
    attributes: product?.attributes,
    bestSeller: product?.bestSeller,
    brand: product?.brand,
    brandSlug: product?.brandSlug,
    classification: product?.classification,
    condition: product?.condition,
    currentStock: product?.currentStock,
    description: product?.description,
    displayOrder: product?.displayOrder,
    exclusive: product?.exclusive,
    flags: product?.flags,
    fulfilFromSupplier: product?.fulfilFromSupplier,
    fulfilFromSupplierDays: product?.fulfilFromSupplierDays,
    fulfilFromWarehouse: product?.fulfilFromWarehouse,
    fulfilFromWarehouseDays: product?.fulfilFromWarehouseDays,
    groupName: product?.groupName,
    groupNameList: product?.groupNameList,
    image: product?.image,
    images: product?.images?.length
      ? product?.images?.map((image: any) => ({
          alt: image?.alt,
          displayOrder: image?.displayOrder,
          isActive: image?.isActive,
          name: image?.name,
          tag: image?.tag,
          url: image?.url,
        }))
      : new Array<any>(),
    itemPerCarton: product?.itemPerCarton || EmptyString,
    itemType: product?.itemType,
    listPrice: product?.listPrice,
    name: product?.name,
    newLaunch: product?.newLaunch,
    onSale: product?.onSale,
    preOrder: product?.preOrder,
    price: product?.price,
    productId: product?.productId || EmptyString,
    promotions: product?.promotions,
    rating: product?.rating,
    recordId: product?.recordId,
    relatedType: product?.relatedType,
    reviewCount: product?.reviewCount,
    sellableType: product?.sellableType || EmptyString,
    shortDescription: product?.shortDescription,
    stockAvailabilityMessage: product?.stockAvailabilityMessage,
    sku: product?.sku,
    slug: product?.slug,
    stockCode: product?.stockCode,
    subBrand: product?.subBrand,
    trending: product?.trending,
    variantGroupCode: product?.variantGroupCode,
    variantProductsAttributeMinimal: product?.variantProductsAttributeMinimal,
    variantProductsMinimal: product?.variantProductsMinimal,
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
      results: response?.products?.results?.length
        ? getProductListTransform(response?.products?.results)
        : new Array<any>(),
    },
  }),
}

export const getRelatedProductsTransformMap = {
  data: (results: any) =>
    results?.length ? getProductListTransform(results) : new Array<any>(),
}

export default apiRouteGuard(getCollectionApiMiddleware)
