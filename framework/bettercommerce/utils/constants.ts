import { stringToBoolean } from './parse-util'

export const STATIC_PAGE_CACHE_INVALIDATION_IN_60_SECONDS = 60
export const STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS = 200
export const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
export const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
export const BASE_URL = process.env.BETTERCOMMERCE_BASE_URL
export const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
export const STATIC_BRANDS_PATH_ENABLED = stringToBoolean(process.env.STATIC_BRANDS_PATH_ENABLED)
export const OMS_BASE_URL = process.env.OMS_BASE_URL
export const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID

export const BETTERCMS_BASE_URL = process.env.BETTERCMS_BASE_URL
export const IS_TEST_PAYMENT_ENABLED_ON_LIVE =
  process.env.IS_TEST_PAYMENT_ENABLED_ON_LIVE
export const TEST_PAYMENT_AMOUNT = process.env.TEST_PAYMENT_AMOUNT
  ? parseFloat(process.env.TEST_PAYMENT_AMOUNT)
  : 0.0

export const BETTERCMS_API_VERSION = process.env.BETTERCMS_API_VERSION
export const BETTERCMS_API_URL = process.env.BETTERCMS_API_URL
export const HOME_PAGE_DEFAULT_SLUG = 'home'
export const CIPHER_ENCRYPTION_KEY = process.env.CIPHER_ENCRYPTION_KEY

// google analytics
export const GA4_DISABLED = stringToBoolean(process.env.GA4_DISABLED)
export const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID

export const ERROR_LOG_ENABLED = stringToBoolean(process.env.ERROR_LOG_ENABLED)
export const ERROR_LOG_OUTPUT_DIR = process.env.ERROR_LOG_OUTPUT_DIR

export const HTTP_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
}
export const PRODUCT_IMAGE_CDN_URL = process.env.PRODUCT_IMAGE_CDN_URL
export const OMNILYTICS_DISABLED = stringToBoolean(
  process.env.OMNILYTICS_DISABLED
)

export module Cookie {
  export module Key {
    export const CURRENCY = 'Currency'
    export const CURRENT_CURRENCY = 'CurCurrency'
    export const LANGUAGE = 'Language'
    export const COUNTRY = 'Country'
    export const SESSION_ID = 'sessionId'
    export const BASKET_ID = 'basketId'
    export const ORDER_ID = 'orderId'
    export const COMPANY_ID = 'CompanyId'
    export const GOOGLE_TRANSLATE = 'googtrans'
    export const CLIENT_IP_ADDRESS = 'ClientIP'
    export const IS_PAYMENT_LINK = 'ipl'
    export const API_TOKEN = 'i'
    export const USER_TOKEN = 'ut'
    export const ANALYTICS = 'analytics'
    export const ADVERTISEMENT = 'advertisement'
    export const NAV_ENDPOINT_DATA_CACHED = 'nedc'
    export const ALGOLIA_SETTINGS_DATA_CACHED = 'asdc'
  }
}
