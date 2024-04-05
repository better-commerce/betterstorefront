import { stringToBoolean } from '@framework/utils/parse-util'
import { toNumber } from 'lodash'

//BETTERCOMMERCE ENDPOINTS
export const HOMEPAGE_SLUG = `/`
export const OMS_SHIPPING_PLANS = '/api/v1/oms/shipment/plans'
export const OMS_CLICK_AND_COLLECT = '/api/v1/oms/store/clickandcollect'
export const NEXT_CLICK_AND_COLLECT = '/api/shipping-plans/click-collect'
export const NEXT_SHIPPING_PLANS = '/api/shipping-plans/plans'
export const NEXT_UPDATE_DELIVERY_INFO = '/api/shipping-plans/update-delivery'
export const NEXT_UPDATE_CHECKOUT2_ADDRESS =
  '/api/basket/update-checkout2-address'
export const CATEGORY_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/category`
export const XML_FEED = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/feed`
export const NAV_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/nav`
export const COLLECTIONS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/collection`
export const CANCEL_REASON = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/masterdata`
export const LOOKBOOK_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/lookbook`
export const SITEVIEW_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/content/siteview`
export const CATALOG_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/brand`
export const NEXT_RETURN_ORDER_LINE = `/api/return-order-line`
export const SEARCH_MINIMAL_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/advanced/minimal`
export const SEARCH_ADVANCED_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/advanced`
export const CACHED_IMAGE_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product`
export const LOOKBOOK_SLUG_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/lookbook/slug`
export const NEXT_SEARCH_ADVANCED_ENDPOINT = '/api/catalog/get-category-products'
export const PRODUCT_CUSTOM_ATTRIBUTES = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/custom-attributes`
export const PRODUCT_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/`
export const PRODUCT_PREVIEW_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/preview`
export const BASKET_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket`
export const GET_BASKET_PROMOTIONS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/basket-promotions`
export const BASKET_VALIDATE_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket/validate`
export const REGISTER_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/create`
export const REGISTER_CUSTOMER_TRADING_ACCOUNT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/b2b/create`
export const B2B_COMPANY_USERS = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/b2b/`
export const B2B_USER_QUOTES = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/b2b/`
export const AUTHENTICATE_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/authenticate`
export const SOCIAL_AUTHENTICATE_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/social-login`
export const REVIEW_SERVICE_BASE_API = `${process.env.BETTERCOMMERCE_REVIEW_BASE_URL}/api/v1/service`
export const CUSTOMER_BASE_API = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/`
export const CUSTOMER_NEWSLETTER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/newsletter/subscribe`
export const ORDERS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/order/`
export const ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/`
export const CREATE_ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/create`
export const CATALOG_SEARCH = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/r`
export const STORE_LOCATOR_API = '/api/v1/oms/store'
export const BASE_SEARCH_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search`
export const SHIPPING_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/shipping-method`
export const CHECKOUT_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout`
export const PAYMENTS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout/payment-methods`
export const RETURNS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/return`
export const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
export const INFRA_PLUGIN_CATEGORY_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config/plugin/category`
export const KEYWORDS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/keyword-redirections`
export const LOQATE_ADDRESS = '/api/loqate'
export const RETRIEVE_ADDRESS = '/api/retrieve-address'
export const PROMOTION_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/`
export const PRODUCT_PROMOTION_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/product-promotions`
export const INFRA_LOG_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/log`
export const NOTIFICATION_OTP_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/notification/otp`
export const VALIDATE_CHANGE_USERNAME_OTP_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/notification`
export const REFERRAL_INFO_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/program`
export const REFERRAL_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer`
export const REFERRAL_BY_EMAIL = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/by-email`
export const REFERRAL_BY_SLUG = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/validate-code`
export const REFERRAL_BY_USERID = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/by-userid`
export const REFERRAL_REFEREE_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referee/`
export const REFERRAL_BY_USERNAME = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/by-username`
export const REFERRAL_SEARCH = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/search`
export const REFERRAL_VOUCHERS = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/referral/referrer/vouchers`
export const FACEBOOK_SHARE_STRING = `https://www.facebook.com/sharer/sharer.php`
export const TWITTER_SHARE_STRING = `https://twitter.com/intent/tweet`
export const NEXT_GET_COUNTRIES = '/api/countries'
//LOCAL ENDPOINTS
export const NEXT_API_PRICE_MATCH_ENDPOINT = `/api/price-match`
export const NEXT_API_KEYWORDS_ENDPOINT = '/api/keywords'
export const NEXT_API_NOTIFY_ME_ENDPOINT = `/api/notify-me/`
export const PRICE_MATCH_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket/pricematch/add`
export const NEXT_ADD_TO_CART = `/api/add-item-cart`
export const NEXT_BULK_ADD_TO_CART = `/api/bulk-add-cart`
export const NEXT_UPDATE_CART_INFO = `/api/update-cart-info`
export const NEXT_GET_ORDER_DETAILS = '/api/customer/order-details'
export const NEXT_GET_CART = `/api/get-cart`
export const NEXT_ASSOCIATE_CART = '/api/customer/associate-cart'
export const NEXT_MERGE_CART = '/api/merge-cart'
export const STATIC_BRAND_PATHS = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/staticpath/brand`
export const NEXT_GET_COLLECTION_BY_ID = '/api/collection/get-collection-by-id'
export const NEXT_GET_USER_CART = '/api/get-user-cart'
export const NEXT_GET_CATALOG_PRODUCTS = '/api/catalog/products'
export const NEXT_GET_ORDER_RELATED_PRODUCTS =
  '/api/catalog/get-related-products'
export const NEXT_PAYMENT_METHODS_LIST = '/api/payment-methods-list'
export const NEXT_GET_ALT_RELATED_PRODUCTS =
  '/api/catalog/get-alternate-related-product'
export const NEXT_SIGN_UP = `/api/signup`
export const NEXT_SIGN_UP_TRADING_ACCOUNT = `/api/signup-trading-account`
export const NEXT_VALIDATE_EMAIL = `/api/customer/validate-email`
export const NEXT_VALIDATE_PAYMENT_LINK = `/api/payments/validate-payment-link`
export const NEXT_AUTHENTICATE = `/api/login`
export const NEXT_SSO_AUTHENTICATE = `/api/login/sso`
export const NEXT_UPDATE_DETAILS = `/api/customer/update-details`
export const NEXT_SUBSCRIBE = `/api/customer/subscribe`
export const NEXT_GET_ORDERS = `/api/customer/orders`
export const NEXT_GET_WISHLIST = `/api/customer/get-wishlist`
export const NEXT_CREATE_WISHLIST = `/api/customer/create-wishlist`
export const NEXT_REMOVE_WISHLIST = `/api/customer/remove-item-from-wishlist`
export const NEXT_GET_SINGLE_LOOKBOOK = '/api/get-single-lookbook'
export const NEXT_ADDRESS = `/api/customer/address`
export const NEXT_EDIT_ADDRESS = `/api/customer/edit-address`
export const NEXT_CREATE_ADDRESS = `/api/customer/create-address`
export const NEXT_DELETE_ADDRESS = `/api/customer/delete-address`
export const NEXT_GET_CUSTOMER_DETAILS = `/api/customer/get-customer-details`
export const MASTER_DATA_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/masterdata`
export const NEXT_GET_ORDER = `/api/order/order-details`
export const NEXT_CANCEL_REASON = `/api/cancel-reason`
export const NEXT_CANCEL_ORDER = `/api/order/cancel`
export const NEXT_CANCEL_ORDER_LINE = `/api/order/cancel-order-line`
export const NEXT_RETURN_REASON = `/api/return-reason`

export const NEXT_GET_REVIEW_SUMMARY = `/api/reviews/get-review-summary`
export const NEXT_CREATE_REVIEW = `/api/create-review`
export const NEXT_GET_NAVIGATION = `/api/get-navigation`
export const NEXT_GET_PRODUCT_PROMOS = '/api/catalog/get-product-promos'
export const NEXT_GET_BASKET_PROMOS = `/api/get-basket-promotions`
export const NEXT_BASKET_VALIDATE = `/api/basket/validate`
export const NEXT_APPLY_PROMOTION = `/api/apply-promo`
export const PAGE_PREVIEW_CONTENT_ENDPOINT = `api/${process.env.BETTERCMS_API_VERSION}/page`
export const NEXT_B2B_GET_USERS = `/api/b2b/get-users`
export const NEXT_B2B_GET_QUOTES = `/api/b2b/get-quotes`
export const NEXT_SHIPPING_ENDPOINT = '/api/shipping-options'
export const NEXT_UPDATE_CHECKOUT_ADDRESS = '/api/update-checkout-address'
export const NEXT_UPDATE_SHIPPING = '/api/update-shipping'
export const NEXT_GUEST_CHECKOUT = '/api/customer/guest-checkout'
export const NEXT_LOGIN_CHECKOUT = '/api/customer/login-checkout'
export const NEXT_SEARCH_PRODUCTS = `/api/catalog/search`
export const NEXT_GET_PRODUCT = '/api/catalog/get-product'
export const NEXT_GET_PRODUCT_PREVIEW = '/api/catalog/get-product-preview'
export const NEXT_CONTACT_US = `/api/customer/contact-us`
export const NEXT_PAYMENT_METHODS = '/api/payment-methods'
export const NEXT_INFRA_ENDPOINT = '/api/infra'
export const NEXT_SET_CONFIG = '/api/set-config'
export const NEXT_FORGOT_PASSWORD = '/api/customer/forgot-password'
export const NEXT_RESET_PASSWORD = '/api/customer/reset-password'
export const NEXT_VALIDATE_TOKEN = '/api/customer/validate-token'
export const NEXT_GET_RETURN_DATA = '/api/return/get-return-data'
export const NEXT_CREATE_RETURN_DATA = '/api/return/create'
export const NEXT_GET_RETURNS = '/api/return/get-user-returns'
export const NEXT_POST_LOGGER = '/api/app-logger'
export const PAYMENTS_API = `/api/payments`
export const NEXT_OTP_REQUEST = '/api/notification/otp'
export const NEXT_VALIDATE_CHANGE_USERNAME_OTP =
  '/api/notification/validate-change-username-otp'
export const NEXT_REFERRAL_BY_EMAIL = '/api/customer/referral/referral-by-email'
export const NEXT_REFERRAL_BY_USERID =
  '/api/customer/referral/referral-by-userId'
export const NEXT_REFERRAL_BY_USERNAME =
  '/api/customer/referral/referral-by-username'
export const NEXT_REFERRAL_BY_SLUG = '/api/customer/referral/referral-by-slug'
export const NEXT_REFERRAL_SEARCH = '/api/customer/referral/referral-search'
export const NEXT_REFERRAL_ADD_USER_REFEREE =
  '/api/customer/referral/referral-add-user-referee'
export const NEXT_REFERRAL_INVITE_SENT =
  '/api/customer/referral/referral-invite-sent'
export const NEXT_REFERRAL_CLICK_ON_INVITE =
  '/api/customer/referral/referral-click-on-invite'
export const NEXT_REFERRAL_INFO = '/api/customer/referral/referral-info'
export const NEXT_REFERRAL_VOUCHERS = '/api/customer/referral/referral-vouchers'
export const NEXT_GET_ADDON_PRODUCTS = `/api/get-addon-products`
export const NEXT_COMPARE_ATTRIBUTE = '/api/compare-attributes'
export const NEXT_LOG_ACTIVITY = '/api/log/activity'
export const NEXT_LOG_PAYMENT = '/api/log/payment'
export const NEXT_GET_SUBJECTS = '/api/subjects'

// Store Locator
export const NEXT_STORE_LOCATOR = '/api/store-locator/get-stores'
export const NEXT_GET_ALL_STORES = '/api/store-locator/get-all-stores'
export const NEXT_GET_STORES_DETAILS = '/api/store-locator/get-store-details'
export const NEXT_POST_STORE_BY_POSTALCODE = '/api/store-locator/get-store-by-postalcode'
export const NEXT_GOOGLE_AUTOCOMPLETE_API = '/api/store-locator/get-place-by-google-api'
export const NEXT_PLACE_DETAILS_API = '/api/store-locator/get-addess-details-api'
export const NEXT_GET_GOOGLE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
export const NEXT_GET_PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json'
export const GET_ALL_STORES = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/stores/all`
export const GET_STORES_DETAILS = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/stores`
export const POST_STORE_BY_POSTALCODE = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/stores`

//CONSTANTS

export const YOUTUBE_VIDEO_EMBED_PREFIX_URL =
  'https://www.youtube-nocookie.com/embed'
export const NEXT_GET_PRODUCT_QUICK_VIEW = '/api/catalog/get-product-quick-view'

export const NEXT_GET_PRODUCT_REVIEW = '/api/catalog/get-product-reviews'
export const DefaultSessionCookieKey: string = `defaultSession`
export const SessionIdCookieKey: string = `sessionId`
export const DeviceIdKey: string = `deviceId`

//SHIPPING ACTION TYPES
export const SHIPPING_ACTION_TYPES_MAP = {
  GET_ALL: 'GET_ALL',
  CLICK_AND_COLLECT: 'CLICK_AND_COLLECT',
  ACTIVE_SHIPPING_METHODS: 'ACTIVE_SHIPPING_METHODS',
}

export const NEXT_GEO_ENDPOINT =
  process.env.NEXT_PUBLIC_GEO_ENDPOINT ||
  'https://omnilytics.bettercommerce.io/api/v1/IpInfo?ipAddress='
export const UPDATE_ORDER_STATUS = '/api/update-order-status'

export const NEXT_PUBLIC_DEFAULT_CACHE_TIME =
  process.env.NEXT_PUBLIC_DEFAULT_CACHE_TIME_IN_MILLI_SECS
export const NEXT_PUBLIC_API_CACHING_LOG_ENABLED =
  process.env.NEXT_PUBLIC_API_CACHING_LOG_ENABLED
export const SEARCH_PROVIDER = process.env.SEARCH_PROVIDER
// Default currency, language & country settings.
export const BETTERCOMMERCE_DEFAULT_CURRENCY =
  process.env.BETTERCOMMERCE_DEFAULT_CURRENCY
export const BETTERCOMMERCE_DEFAULT_LANGUAGE =
  process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE
export const BETTERCOMMERCE_DEFAULT_COUNTRY =
  process.env.BETTERCOMMERCE_DEFAULT_COUNTRY
export const BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE =
  process.env.BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE

// Override currency, language & country settings ONLY FOR specific storefronts WHEREVER REQUIRED.
export const BETTERCOMMERCE_CURRENCY = process.env.BETTERCOMMERCE_CURRENCY
export const BETTERCOMMERCE_LANGUAGE = process.env.BETTERCOMMERCE_LANGUAGE
export const BETTERCOMMERCE_COUNTRY = process.env.BETTERCOMMERCE_COUNTRY
export const SHOW_APPLY_COUPON_SECTION = true
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const CONTACT_DETAILS_EMAIL = 'support.bettercommerce.io'
export const SITE_HOST = process.env.SITE_HOST
export const SITE_ORIGIN_URL = process.env.SITE_ORIGIN_URL
export const SITE_NAME = process.env.SITE_NAME
export const ENABLE_SECURED_PAYMENT_PAYLOAD = stringToBoolean(
  process.env.ENABLE_SECURED_PAYMENT_PAYLOAD
)
export const ENABLE_ELASTIC_SEARCH = stringToBoolean(
  process.env.ENABLE_ELASTIC_SEARCH
)
export const SECURE_PAYMENT_METHODS_SETTINGS_FIELDS = stringToBoolean(
  process.env.SECURE_PAYMENT_METHODS_SETTINGS_FIELDS
)
export const PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS =
  process.env.PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS

export const OTP_LOGIN_ENABLED = stringToBoolean(process.env.OTP_LOGIN_ENABLED)
export const CURRENT_THEME = process.env.CURRENT_THEME
export const OMNILYTICS_DISABLED = process.env.OMNILYTICS_DISABLED
export const PDP_SIZE_OPTIONS_COUNT = parseInt(
  process.env.PDP_SIZE_OPTIONS_COUNT || '0'
)
export const MAX_ADD_TO_CART_LIMIT = 5
export const NEXT_GET_PROOMO_DETAILS = '/api/catalog/get-promo-details'
export const STATIC_CATEGORY_PATHS = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/staticpath/category`
export module Messages {
  export module Validations {
    export module RegularExpressions {
      export const NUMBERS_ONLY = /^[0-9]*$/
      export const MOBILE_NUMBER =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
      export const EMAIL =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      export const FULL_NAME = /^[a-zA-Z 0-9\-]*$/
      export const ADDRESS_LINE = /^[a-zA-Z 0-9\-\,\/\.]*$/
      export const ADDRESS_LABEL = /^[a-zA-Z 0-9\-]*$/
      export const CARD_NUMBER = /^[0-9]*$/
      export const CARD_EXPIRY = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/
      export const CARD_CVV = /^[0-9]*$/
      export const URL =
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
      export const FIND_EMPTY_CHARACTERS = /\s/g
      export const REPLACE_DEFAULT_UPI_WEB_PREFIX_URL = /upi:\/\//g
      export const CHARACTERS_AND_ALPHABETS =
        /([a-zA-Z/!#\$@^%&*()+=;\-'\]"{:<>\\\\,.?|[~_`}/])/g
      export const PASSWORD_VALIDATION = /^(?=.*[A-Z]).{8,}$/
      export const STOCK_CODE = /^[a-zA-Z0-9\\-]+$/g
      export const QUANTITY = /^[1-9]{1}[0-9]*$/g
      export const CSV_DATA = /^[a-zA-Z0-9\-]+\,([1-9]{1}\d*)([\r]*[\n])*$/gm
      export const EMPTY_SPACE = /\S/
    }

    export const Login: any = {
      MOBILE_NUMBER_REQUIRED: 'Mobile number is a required field',
      MOBILE_NUMBER_INPUT: 'Mobile number should only contain numbers',
      MOBILE_NUMBER_LENGTH: 'Mobile number should be 10 characters',
    }

    export const BulkOrder: any = {
      DEFAULT_ENTRY_FIELD_COUNT: 5,
    }

    export const Profile: any = {
      NAME_REQUIRED: 'Full name is a required field',
      NAME_MIN_LENGTH: 'Full name must be at least 3 characters',
      NAME_INPUT: 'Full name should only contain alpha-numerics',

      MOBILE_NUMBER_REQUIRED: 'Mobile number is a required field',
      MOBILE_NUMBER_INPUT: 'Mobile number should only contain numbers',
      CHANGED_MOBILE_NUMBER_INPUT:
        'New mobile number entered is currently in use',
      EMAIL_REQUIRED: 'Email is a required field',
      EMAIL_INPUT: 'Email is not valid',
    }

    export const AddNewAddress: any = {
      POST_CODE_REQUIRED: 'Postcode is a required field',
      POST_CODE_UNREACHABLE: 'Postcode non-serviceable',
      POST_CODE_NUM: 'Postcode should contain only digits',
      CITY_REQUIRED: 'City is a required field',
      STATE_REQUIRED: 'State is a required field',
      COUNTRY_REQUIRED : 'Country is a required field',
      ADDRESS_1_REQUIRED: 'Address 1 is a required field',
      ADDRESS_1_INPUT: 'Address 1 should only contain alpha-numerics',
      ADDRESS_2_INPUT: 'Address 2 should only contain alpha-numerics',
      ADDRESS_3_INPUT: 'Address 2 should only contain alpha-numerics',

      FIRST_NAME_REQUIRED: 'First Name is a required field',
      LAST_NAME_REQUIRED : 'Last Name is a required field',
      FIRST_NAME_MIN_LENGTH: 'Name must be at least 3 characters',
      FIRST_NAME_INPUT: 'Name should only contain alpha-numerics',
      LAST_NAME_MIN_LENGTH: 'Name must be at least 3 characters',
      LAST_NAME_INPUT: 'Name should only contain alpha-numerics',

      MOBILE_NUMBER_REQUIRED: 'Mobile number is a required field',
      MOBILE_NUMBER_INPUT: 'Mobile number should only contain numbers',

      ADDRESS_TYPE_REQUIRED: 'Address is a required field',
      ADDRESS_TYPE_MIN_LENGTH: 'Address Field should be more than 3 characters',
      ADDRESS_TYPE_INPUT: 'Address should only contain alpha-numerics',
    }

    export const AddNewCard: any = {
      CARD_NUMBER_REQUIRED: 'Card number is a required field',
      CARD_NUMBER_MIN_LENGTH: 'Card Number must be at least 14 characters',
      CARD_NUMBER_INPUT: 'Card number should contain only digits',

      EXPIRY_REQUIRED: 'Expiry is a required field',
      EXPIRY_INPUT: 'Expiry should be in MM/YY format',

      CVV_REQUIRED: 'CVV is a required field',
      CVV_INPUT: 'CVV should only contain alpha-numerics',

      NAME_REQUIRED: 'Name is a required field',
      NAME_MIN_LENGTH: 'Name must be at least 3 characters',
      NAME_INPUT: 'Name should only contain alpha-numerics',
    }

    export const SaveUPI: any = {
      VPA_REQUIRED: 'VPA / UPI ID is a required field',
    }

    export const DeliveryInfo: any = {
      POST_CODE_REQUIRED: 'Postcode is a required field',
      POST_CODE_MIN_LENGTH: 'Postcode must be at least 6 characters',
      VALID_POST: 'Please enter a valid postcode',
      POST_CODE_MAX_LENGTH: 'Postcode must be at max 6 characters',
      POST_CODE_INPUT: 'Postcode should only contain numbers',
    }
    export const ResetPassword: any = {
      PASSWORD_VALIDATION_MESSAGE:
        'Password should have a minimum of 8 characters and at least 1 uppercase letter.',
      PASSWORD_REQUIRED_MESSAGE: 'Password is required.',
      CONFIRM_REQUIRED_MESSAGE: 'Confirm password is required.',
      MATCHING_PASSWORD_MESSAGE: 'Passwords must match.',
      NO_EMAIL: 'Please enter correct email',
      INVALID_EMAIL: "We couldn't find an account with this email",
      VALID_EMAIL:
        'Success! Check your email for the link to change your password',
    }

    export const ChequePayment: any = {
      CHEQUE_NUMBER_REQUIRED: 'Cheque number is a required',
      CHEQUE_NUMBER_INPUT: 'Cheque Number should only contain digits',
    }

    export const PaymentLink: any = {
      LINK_EXPIRED: 'Payment link is expired',
    }

    export module CheckoutSection {
      export const BILLING_ADDRESS_NOT_FOUND = 'Billing address not found'
      export const SHIPPING_ADDRESS_NOT_FOUND = 'Shipping address not found'

      export const ContactDetails: any = {
        B2B_GUEST_CHECKOUT_NOT_ALLOWED:
          'Guest checkout not allowed with the provided e-mail address',
        FIRST_NAME_REQUIRED: 'First Name is a required field',
        FIRST_NAME_MIN_LEN: 'First Name must be at least 3 characters',
        FIRST_NAME_INPUT: 'First Name should only contain alpha-numerics',
        LAST_NAME_REQUIRED: 'Last Name is a required field',
        LAST_NAME_MIN_LEN: 'Last Name must be at least 3 characters',
        LAST_NAME_INPUT: 'First Name should only contain alpha-numerics',
        EMAIL_ADDRESS_REQUIRED: 'Email Address is a required field',
        EMAIL_ADDRESS_INPUT: 'Email Address is not valid',
        PHONE_NUMBER_REQUIRED: 'Phone Number is a required field',
        PHONE_NUMBER_INPUT: 'Phone Number is not valid',
        PHONE_NUMBER_MAX_LEN: 'Phone Number must be at most 12 digits',
        PHONE_NUMBER_MIN_LEN: 'Phone Number must be at least 7 digits',
      }

      export const BillingAddressDetails: any = {
        COMPANY_NAME_REQUIRED: 'Company name is required',
        POST_CODE_MAX_LEN: 'Postcode must be at most 10 digits',
        POST_CODE_REQUIRED: 'Postcode is a required field',
        POST_CODE_NUMBER: 'Postcode must only contain numbers',
      }
    }
  }
  export const Messages: any = {
    RETURN_SUCCESS: 'Return success',
    EXCHANGE_SUCCESS: 'Exchange successful',
    RESET_PASSWORD_SUCCESS: 'Success! You will be redirected to login page',
  }

  // export const Warnings: any = {}

  // export const Errors: any = {
  //   INVALID_REQUEST: 'The information provided is incomplete. Please try again.',
  //   ERR_BAD_REQUEST: 'The information provided is incomplete. Please try again.',
  //   CARD_NOT_SUPPORTED: 'Card type is not supported. Please try again.',
  //   INVALID_OTP_SUPPLIED: 'OTP is not valid. Please try again.',
  //   ERROR_UPDATE_ADDITIONAL_CHARGES: 'Error applying COD additional charges. Please try again after sometime.',
  //   UNSUPPORTED_UPI_APP: 'UPI payment is unsupported.',
  //   NOT_FOUND:'Your request could not be processed. Please try again after sometime.',
  //   USERNAME_ALREADY_EXISTS: 'User already exists',
  //   CUSTOMER_NOT_FOUND: 'Customer not found.',
  //   GENERIC_ERROR: 'Your request could not be processed. Please try again after sometime.',
  //   DUPLICATE_ADDRESS : 'Address already exists',
  //   CART_EMPTY: 'Your cart is empty',
  //   CART_ITEM_QTY_LIMIT_EXCEEDED: 'Max allowed quantity is {maxBasketItemsCount}.',
  //   BASKET_VALIDATION_FAILED: 'Basket validation failed',
  //   'YourBag.Links.EmptyBag': 'Payment for your basket is already completed.',
  //   TOKEN_INVALID: 'Woops! Token is invalid',
  //   TOKEN_EXPIRED: 'Woops! Token is expired or invalid',
  //   COMPANY_NOT_FOUND: 'Company not found.',
  //   COMPANY_CREDIT_LIMIT_EXCEEDED: 'Not enough credit available.',
  //   ADDRESS_NOT_FOUND: 'No address found for the given postcode'
  // }

//   export const ContactUs: any = {
//     FIRST_NAME_REQUIRED: 'First Name is a required field',
//     FIRST_NAME_MIN_LEN: 'First Name must be at least 3 characters',
//     FIRST_NAME_INPUT: 'First Name should only contain alpha-numerics',
//     EMAIL_ADDRESS_REQUIRED: 'Email Address is a required field',
//     EMAIL_ADDRESS_INPUT: 'Email Address is not valid',
//     FORM_SUBMIT_SUCCESS: 'Form Submit successfully',
//     TITLE_REQUIRED: 'Title is a require field',
//     MESSAGE_REQUIRED: 'Message is a require field',
//   }
}
export const EmptyObject: any = {}
export module PageActions {
  // Actions assigned: 1 to 50
  export enum BulkOrder {
    ADD_TO_CART = 1,
  }
}
export const ALERT_TIMER = 5000

export const DATE_FORMAT = 'DD-MMM-yy'
export const DATE_TIME_FORMAT = 'DD-MMM-yy HH:mm'
export const PRODUCTS_SLUG_PREFIX = 'products/'
export const EmptyString = ''
export const collectionSlug = 'you-may-also-like'
export const CLOTH_SIZE_ATTRIB_NAME = 'clothing.size'
export const CLOTH_COLOUR_ATTRIB_NAME = 'global.colour'

export enum OrderStatus {
  PENDING = 'Pending',
  INCOMPLETE = 'Incomplete',
  APPROVED = 'Approved',
  RETURNED_FROM_WAREHOUSE = 'RetrunedFromWarehouse',
  UNFULFILLABLE = 'Unfulfillable',
  ACCEPTED_IN_WAREHOUSE = 'AcceptedInWarehouse',
  ACCEPTED = 'Accepted',
  READY_TO_DISPATCH = 'ReadyToDispatch',
  DISPATCH = 'Dispatch',
  PICKED_UP = 'PICKED UP',
  SHIPMENT_DELAYED = 'SHIPMENT DELAYED',
  IN_TRANSIT = 'In Transit',
  OUT_FOR_DELIVERY = 'OUT FOR DELIVERY',
  DELIVERED = 'Delivered',
  FAILED_DELIVERY = 'FAILED DELIVERY',
  RTO_REQUESTED = 'RTO REQUESTED',
  RTO_RECEIVED = 'RTO Received',
  RTO_RECEIVED_1 = 'RTOReceived',
  CANCELLED = 'Cancelled',
  CANCELLED_FAILED_FRAUD_SCREENING = 'CancelledFailedFraudScreening',
  CANCELLED_FAILED_FRAUD_SCREENING_1 = 'OrderStatusCancelledFailedFraudScreening',
  RETURN_REQUESTED = 'Return Requested',
  RMA_FAILED_SCREENING = 'RMA FailedScreening',
  RMA_PROCESSING = 'RMA Processing',
  CONFIRMED = 'Confirmed',
  RETURN_OUT_FOR_PICKUP = 'Return Out for Pickup',
  RETURN_PICKUP_RESCHEDULED = 'Return Pickup Rescheduled',
  RETURN_PICKEDUP = 'Return Pickedup',
  RETURN_PICKUP_CANCELLED = 'Return Pickup Cancelled',
  RMA_RECEIVED = 'RMA Received',
  REFUNDED = 'Refunded',
  CANCELLED_BY_CUSTOMER = 'CancelledByCustomer',
  CANCELLED_BY_STORE = 'CancelledByStore',
}

export const PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES =
  process.env.PDP_REVIEW_ACCEPTABLE_IMAGE_MIMES
export const PDP_REVIEW_NO_OF_IMAGES_ALLOWED = toNumber(
  process.env.PDP_REVIEW_NO_OF_IMAGES_ALLOWED
)
export const PDP_REVIEW_IMAGE_SIZE_IN_BYTES = toNumber(
  process.env.PDP_REVIEW_IMAGE_SIZE_IN_BYTES
)

export const SHORT_ALERT_TIMER = 2500
export enum AddressPageAction {
  SAVE = 0,
  SELECT_ADDRESS = 1,
}
export const NEXT_PINCODE_LOOKUP = '/api/checkout/pincode-lookup'
export const OTP_TIMER = 45

export enum PluginCategory {
  SOCIAL_LOGIN = 'SocialLogin',
}

export enum SocialMediaType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export const PRODUCT_TAGS = {
  newLaunch: 'New Launch',
  onSale: 'On Sale',
  trending: 'Trending',
  exclusive: 'Exclusive',
  bestSeller: 'BestSeller',
}

export enum CheckoutStepType {
  NONE = 0,
  CONTACT_DETAILS = 1,
  DELIVERY_DETAILS = 2,
  DELIVERY_METHOD = 3,
  PAYMENT_METHOD = 4,
  REVIEW_AND_PLACE_ORDER = 5,
  REVIEW_AND_PLACE_ORDER_PAYMENT_SECTION = 51, // Ordinal introduced for fix for scroll issue on checkout page.
  BILLING_DELIVERY_DETAILS = 6,
}

export enum LoadingActionType {
  NONE = 0,
  REMOVE_ITEM = 1,
  MOVE_TO_WISHLIST = 2,
}

export const EmptyGuid = '00000000-0000-0000-0000-000000000000'

export enum QuantityBreakRule {
  FIXED_PRICE = 1,
  PERCENTAGE = 2,
}
