import type { CommerceAPI, CommerceAPIConfig } from '@commerce/api'
import { getCommerceApi as commerceApi } from '@commerce/api'
import createFetcher from './utils/fetch-local'
import {
  getInfra,
  getSlugs,
  getProduct,
  getProductPreview,
  getAllProducts,
  getAllProductPaths,
  getCustomerWishlist,
  getSiteInfo,
  getPage,
  getAllPages,
  notifyMe,
  priceMatch,
  getProductQuickview,
  updateDetails,
  validateEmail,
  subscribe,
  getOrders,
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
  getWishlist,
  createWishlist,
  removeItemFromWishlist,
  createReview,
  applyPromo,  
  getRelatedProducts,
  getPdpLookbook,
  getPdpLookbookProduct,
  getPdpCachedImage,
  getProductPromos,
  getCancelReason,
  cancelOrder,
  getReturnReason,
  getPagePreviewContent,
  getProductReview,
} from './operations'

export interface BetterCommerceConfig extends CommerceAPIConfig {}
const config: BetterCommerceConfig = {
  commerceUrl: '',
  apiToken: '',
  cartCookie: '',
  customerCookie: '',
  cartCookieMaxAge: 2592000,
  fetch: createFetcher(() => getCommerceApi().getConfig()),
}

const operations = {
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
  getProductPreview,
  getInfra,
  getSlugs,
  getProductQuickview,
  notifyMe,
  priceMatch,
  updateDetails,
  validateEmail,
  subscribe,
  getOrders,
  getAddress,
  createAddress,
  deleteAddress,
  editAddress,
  getWishlist,
  createWishlist,
  removeItemFromWishlist,
  createReview,
  applyPromo,
  getRelatedProducts,
  getPdpLookbook,
  getPdpLookbookProduct,
  getPdpCachedImage,
  getProductPromos,
  getCancelReason,
  cancelOrder,
  getReturnReason,
  getPagePreviewContent,
  getProductReview,
}

export const provider = { config, operations }

export type Provider = typeof provider
export type LocalAPI<P extends Provider = Provider> = CommerceAPI<P | any>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): LocalAPI<P> {
  return commerceApi(customProvider as any)
}
