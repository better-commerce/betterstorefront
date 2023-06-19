import { stringToBoolean } from '@framework/utils/parse-util'
import { toNumber } from 'lodash'

//BETTERCOMMERCE ENDPOINTS
export const HOMEPAGE_SLUG = `/`
export const OMS_SHIPPING_PLANS = '/api/v1/oms/shipment/plans'
export const OMS_CLICK_AND_COLLECT = '/api/v1/oms/store/clickandcollect'
export const NEXT_CLICK_AND_COLLECT = '/api/shipping-plans/click-collect'
export const NEXT_SHIPPING_PLANS = '/api/shipping-plans/plans'
export const NEXT_UPDATE_DELIVERY_INFO = '/api/shipping-plans/update-delivery'
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
export const NEXT_SEARCH_ADVANCED_ENDPOINT =
  '/api/catalog/get-category-products'
export const PRODUCT_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/`
export const PRODUCT_PREVIEW_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/preview`
export const BASKET_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket`
export const GET_BASKET_PROMOTIONS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/basket-promotions`
export const BASKET_VALIDATE_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket/validate`
export const REGISTER_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/create`
export const AUTHENTICATE_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/authenticate`
export const CUSTOMER_BASE_API = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/`
export const CUSTOMER_NEWSLETTER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/newsletter/subscribe`
export const ORDERS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/order/`
export const ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/`
export const CREATE_ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/create`
export const NEXT_STORE_LOCATOR = '/api/store-locator/get-stores'
export const CATALOG_SEARCH = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/r`
export const STORE_LOCATOR_API = '/api/v1/oms/store'
export const BASE_SEARCH_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search`
export const SHIPPING_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/shipping-method`
export const CHECKOUT_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout`
export const PAYMENTS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout/payment-methods`
export const RETURNS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/return`
export const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
export const KEYWORDS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/keyword-redirections`
export const LOQATE_ADDRESS = '/api/loqate'
export const RETRIEVE_ADDRESS = '/api/retrieve-address'
export const PROMOTION_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/`
export const PRODUCT_PROMOTION_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/promotion/product-promotions`
export const INFRA_LOG_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/log`
export const NOTIFICATION_OTP_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/notification/otp`
export const VALIDATE_CHANGE_USERNAME_OTP_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/notification`

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
export const NEXT_GET_USER_CART = '/api/get-user-cart'
export const NEXT_GET_ORDER_RELATED_PRODUCTS =
  '/api/catalog/get-related-products'
export const NEXT_GET_ALT_RELATED_PRODUCTS =
  '/api/catalog/get-alternate-related-product'
export const NEXT_SIGN_UP = `/api/signup`
export const NEXT_VALIDATE_EMAIL = `/api/customer/validate-email`
export const NEXT_AUTHENTICATE = `/api/login`
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

export const NEXT_GET_ORDER = `/api/order/order-details`
export const NEXT_CANCEL_REASON = `/api/cancel-reason`
export const NEXT_CANCEL_ORDER = `/api/order/cancel`
export const NEXT_CANCEL_ORDER_LINE = `/api/order/cancel-order-line`
export const NEXT_RETURN_REASON = `/api/return-reason`

export const NEXT_CREATE_REVIEW = `/api/create-review`
export const NEXT_GET_NAVIGATION = `/api/get-navigation`
export const NEXT_GET_PRODUCT_PROMOS = '/api/catalog/get-product-promos'
export const NEXT_GET_BASKET_PROMOS = `/api/get-basket-promotions`
export const NEXT_BASKET_VALIDATE = `/api/basket/validate`
export const NEXT_APPLY_PROMOTION = `/api/apply-promo`
export const PAGE_PREVIEW_CONTENT_ENDPOINT = `api/${process.env.BETTERCMS_API_VERSION}/page`

export const NEXT_SHIPPING_ENDPOINT = '/api/shipping-options'
export const NEXT_UPDATE_CHECKOUT_ADDRESS = '/api/update-checkout-address'
export const NEXT_UPDATE_SHIPPING = '/api/update-shipping'
export const NEXT_GUEST_CHECKOUT = '/api/customer/guest-checkout'
export const NEXT_LOGIN_CHECKOUT = '/api/customer/login-checkout'
export const NEXT_SEARCH_PRODUCTS = `/api/catalog/search`
export const NEXT_GET_PRODUCT = '/api/catalog/get-product'
export const NEXT_GET_PRODUCT_PREVIEW = '/api/catalog/get-product-preview'
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

//CONSTANTS

export const NEXT_GET_PRODUCT_QUICK_VIEW = '/api/catalog/get-product-quick-view'

export const NEXT_GET_PRODUCT_REVIEW = '/api/catalog/get-product-review'
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
export const SITE_ORIGIN_URL = process.env.SITE_ORIGIN_URL
export const SITE_NAME = process.env.SITE_NAME
export const ENABLE_SECURED_PAYMENT_PAYLOAD = stringToBoolean(
  process.env.ENABLE_SECURED_PAYMENT_PAYLOAD
)
export const SECURE_PAYMENT_METHODS_SETTINGS_FIELDS = stringToBoolean(
  process.env.SECURE_PAYMENT_METHODS_SETTINGS_FIELDS
)
export const PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS =
  process.env.PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS

export const OTP_LOGIN_ENABLED = stringToBoolean(process.env.OTP_LOGIN_ENABLED)
export const CURRENT_THEME = process.env.CURRENT_THEME

export module Messages {
  export module Validations {
    export module RegularExpressions {
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
      export const PHONE_NUM = /^([^0-9]*)$/
      export const REPLACE_DEFAULT_UPI_WEB_PREFIX_URL = /upi:\/\//g
      export const CHARACTERS_AND_ALPHABETS =
        /([a-zA-Z/!#\$@^%&*()+=;\-'\]"{:<>\\\\,.?|[~_`}/])/g
    }

    export const Login: any = {
      MOBILE_NUMBER_REQUIRED: 'Mobile number is a required field',
      MOBILE_NUMBER_INPUT: 'Mobile number should only contain numbers',
      MOBILE_NUMBER_LENGTH: 'Mobile number should be 10 characters',
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
      PIN_CODE_REQUIRED: 'Pincode is a required field',
      PIN_CODE_UNREACHABLE: 'Pincode non-serviceable',
      PIN_CODE_NUM: 'Pincode should contain only digits',
      CITY_REQUIRED: 'City is a required field',
      STATE_REQUIRED: 'State is a required field',

      ADDRESS_1_REQUIRED: 'House / Flat/ Office Number is a required field',
      ADDRESS_1_INPUT:
        'House / Flat/ Office Number should only contain alpha-numerics',
      ADDRESS_2_INPUT:
        'Road Name / Area/ Colony should only contain alpha-numerics',

      NAME_REQUIRED: 'Name is a required field',
      NAME_MIN_LENGTH: 'Name must be at least 3 characters',
      NAME_INPUT: 'Name should only contain alpha-numerics',

      MOBILE_NUMBER_REQUIRED: 'Mobile number is a required field',
      MOBILE_NUMBER_INPUT: 'Mobile number should only contain numbers',

      ADDRESS_TYPE_REQUIRED: 'Address is a required field',
      ADDRESS_TYPE_MIN_LENGTH:
        'House/ Flat/ Office Number should be more than 3 characters',
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
      PIN_CODE_REQUIRED: 'Pincode is a required field',
      PIN_CODE_MIN_LENGTH: 'Pincode must be at least 6 characters',
      VALID_PIN: 'Please enter a valid pincode',
      PIN_CODE_MAX_LENGTH: 'Pincode must be at max 6 characters',
      PIN_CODE_INPUT: 'Pincode should only contain numbers',
    }
  }

  export const Messages: any = {
    RETURN_SUCCESS: 'Return success',
    EXCHANGE_SUCCESS: 'Exchange successful',
  }

  export const Warnings: any = {}

  export const Errors: any = {
    INVALID_REQUEST:
      'The information provided is incomplete. Please try again.',
    ERR_BAD_REQUEST:
      'The information provided is incomplete. Please try again.',
    CARD_NOT_SUPPORTED: 'Card type is not supported. Please try again.',
    INVALID_OTP_SUPPLIED: 'OTP is not valid. Please try again.',
    ERROR_UPDATE_ADDITIONAL_CHARGES:
      'Error applying COD additional charges. Please try again after sometime.',
    UNSUPPORTED_UPI_APP: 'UPI payment is unsupported.',
    NOT_FOUND:
      'Your request could not be processed. Please try again after sometime.',
    USERNAME_ALREADY_EXISTS: 'User already exists',
    CUSTOMER_NOT_FOUND: 'Customer not found.',
    GENERIC_ERROR:
      'Your request could not be processed. Please try again after sometime.',
    CART_EMPTY: 'Your cart is empty',
    CART_ITEM_QTY_LIMIT_EXCEEDED: 'Max allowed quantity is 5.',
    BASKET_VALIDATION_FAILED: 'Basket validation failed',
    'YourBag.Links.EmptyBag': 'Payment for your basket is already completed.',
  }
}

export const ALERT_TIMER = 5000

export const DATE_FORMAT = 'DD-MMM-yy'
export const DATE_TIME_FORMAT = 'DD-MMM-yy HH:mm'
export const PRODUCTS_SLUG_PREFIX = 'products/'
export const EmptyGuid = '00000000-0000-0000-0000-000000000000'
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
