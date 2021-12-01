//BETTERCOMMERCE ENDPOINTS
export const HOMEPAGE_SLUG = `/`
export const NAV_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/nav`
export const SITEVIEW_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/content/siteview`
export const SEARCH_MINIMAL_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/advanced/minimal`
export const PRODUCT_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/`
export const BASKET_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket`
export const REGISTER_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/create`
export const AUTHENTICATE_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/authenticate`
export const CUSTOMER_BASE_API = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/`
export const CUSTOMER_NEWSLETTER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/newsletter/subscribe`
export const ORDERS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/order/`
export const ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/`
export const CREATE_ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/create`
export const CATALOG_SEARCH = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/r`
export const SHIPPING_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/shipping`
//LOCAL ENDPOINTS
export const NEXT_API_PRICE_MATCH_ENDPOINT = `/api/price-match`
export const NEXT_API_NOTIFY_ME_ENDPOINT = `/api/notify-me/`
export const PRICE_MATCH_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket/pricematch/add`
export const NEXT_ADD_TO_CART = `/api/add-item-cart`
export const NEXT_BULK_ADD_TO_CART = `/api/bulk-add-cart`
export const NEXT_UPDATE_CART_INFO = `/api/update-cart-info`

export const NEXT_GET_CART = `/api/get-cart`
export const NEXT_ASSOCIATE_CART = '/api/customer/associate-cart'
export const NEXT_MERGE_CART = '/api/merge-cart'
export const NEXT_GET_USER_CART = '/api/get-user-cart'
export const NEXT_SIGN_UP = `/api/signup`
export const NEXT_VALIDATE_EMAIL = `/api/customer/validate-email`
export const NEXT_AUTHENTICATE = `/api/login`
export const NEXT_UPDATE_DETAILS = `/api/customer/update-details`
export const NEXT_SUBSCRIBE = `/api/customer/subscribe`
export const NEXT_GET_ORDERS = `/api/customer/orders`
export const NEXT_GET_WISHLIST = `/api/customer/get-wishlist`
export const NEXT_CREATE_WISHLIST = `/api/customer/create-wishlist`
export const NEXT_REMOVE_WISHLIST = `/api/customer/remove-item-from-wishlist`

export const NEXT_ADDRESS = `/api/customer/address`
export const NEXT_EDIT_ADDRESS = `/api/customer/edit-address`
export const NEXT_CREATE_ADDRESS = `/api/customer/create-address`
export const NEXT_DELETE_ADDRESS = `/api/customer/delete-address`

export const NEXT_CREATE_REVIEW = `/api/create-review`
export const NEXT_GET_NAVIGATION = `/api/get-navigation`

export const NEXT_APPLY_PROMOTION = `/api/apply-promo`

export const NEXT_SHIPPING_ENDPOINT = '/api/shipping-options'
//CONSTANTS

export const SessionIdCookieKey: string = `sessionId`
export const DeviceIdKey: string = `deviceId`

//SHIPPING ACTION TYPES
export const SHIPPING_ACTION_TYPES_MAP = {
  GET_ALL: 'GET_ALL',
  CLICK_AND_COLLECT: 'CLICK_AND_COLLECT',
  ACTIVE_SHIPPING_METHODS: 'ACTIVE_SHIPPING_METHODS',
}
export const GEO_ENDPOINT =
  'https://omnilytics.omnicx.com/api/v1/IpInfo?ipAddress='
