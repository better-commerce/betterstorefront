import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { mapObject } from '@framework/utils/translate-util'

/**
 * API route to get a product by slug.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 */
const getProductApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getProduct({
      query: req.body.slug,
      cookies: req.cookies,
    })
    res.status(200).json({ ...response, ...mapObject(response, getProductTransformMap)?.data })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

/**
 * Maps a product object to only include the properties that are needed
 * for the PDP. This is to reduce the payload size and only include the
 * properties that are needed for the PDP.
 *
 * @param {Object} product - The product object to be mapped.
 * @returns {Object} - The mapped product object.
 */
export const getProductTransform = (product: any) => ({
  //attributeSet: product?.attributeSet,
  availability: product?.availability,
  //barCodes: product?.barCodes,
  //barcode: product?.barcode,
  brand: product?.brand,
  //brandId: product?.brandId,
  //brandLogo: product?.brandLogo,
  //brandRecordId: product?.brandRecordId,
  breadCrumbs: product?.breadCrumbs,
  //buyingIncrements: product?.buyingIncrements,
  //canonicalTags: product?.canonicalTags,
  classification: product?.classification,
  //collections: product?.collections,
  componentProducts: product?.componentProducts,
  //componentsInStock: product?.componentsInStock,
  //condition: product?.condition,
  //couponProvider: product?.couponProvider,
  currentStock: product?.currentStock,
  customAttributes: product?.customAttributes?.length ? product?.customAttributes?.map((attribute: any) => ({ compareAtPDP: attribute?.compareAtPDP, compareAtPLP: attribute?.compareAtPLP, display: attribute?.display, key: attribute?.key, value: attribute?.value, valueText: attribute?.valueText, })) : new Array<any>(),
  cutOffTime: product?.cutOffTime,
  deliveryETA: product?.deliveryETA,
  //deliveryMessage: product?.deliveryMessage,
  description: product?.description,
  //dimensions: product?.dimensions,
  //displayInBasket: product?.displayInBasket,
  //displayTemplate: product?.displayTemplate,
  flags: product?.flags,
  //freeProducts: product?.freeProducts,
  //fulfilFromInstoreDays: product?.fulfilFromInstoreDays,
  //fulfilFromStore: product?.fulfilFromStore,
  fulfilFromSupplier: product?.fulfilFromSupplier,
  fulfilFromSupplierDays: product?.fulfilFromSupplierDays,
  fulfilFromWarehouse: product?.fulfilFromWarehouse,
  fulfilFromWarehouseDays: product?.fulfilFromWarehouseDays,
  //fullName: product?.fullName,
  giftWrapConfig: product?.giftWrapConfig,
  id: product?.id,
  image: product?.image,
  images: product?.images,
  //isDiscontinued: product?.isDiscontinued,
  isGiftWrapApplied: product?.isGiftWrapApplied,
  //isVisible: product?.isVisible,
  //launchDate: product?.launchDate,
  link: product?.link,
  listPrice: product?.listPrice,
  mappedCategories: product?.mappedCategories,
  metaDescription: product?.metaDescription,
  metaKeywords: product?.metaKeywords,
  metaTitle: product?.metaTitle,
  //moq: product?.moq,
  name: product?.name,
  //notes: product?.notes,
  pdFs: product?.pdFs,
  preOrder: product?.preOrder,
  price: product?.price,
  productCode: product?.productCode,
  promotions: product?.promotions,
  quantityBreakRules: product?.quantityBreakRules,
  rating: product?.rating,
  recordId: product?.recordId,
  //relatedProducts: product?.relatedProducts,
  reviewCount: product?.reviewCount,
  reviews: product?.reviews,
  //seoAvailability: product?.seoAvailability,
  //seoName: product?.seoName,
  shortDescription: product?.shortDescription,
  //soldIndependently: product?.soldIndependently,
  //stockAvailabilityMessage: product?.stockAvailabilityMessage,
  stockCode: product?.stockCode,
  //subBrand: product?.subBrand,
  //subBrandId: product?.subBrandId,
  subscriptionEnabled: product?.subscriptionEnabled,
  //subscriptionPlanType: product?.subscriptionPlanType,
  supplierCutoffTime: product?.supplierCutoffTime,
  //uom: product?.uom,
  //uomValue: product?.uomValue,
  variantAttributes: product?.variantAttributes,
  variantGroupCode: product?.variantGroupCode,
  variantProducts: product?.variantProducts,
  videos: product?.videos,
})

export const getProductTransformMap = {

/**
 * Transforms the API response to include only the necessary product data.
 *
 * @param {Object} response - The API response object containing product details.
 * @returns {Object} - An object with the transformed product data.
 */
  data: (response: any) => ({
    product: getProductTransform(response?.product),
  })
}

export default apiRouteGuard(getProductApiMiddleware)
