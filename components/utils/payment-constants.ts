import { TEST_PAYMENT_AMOUNT } from '@framework/utils/constants'
import { BCPaymentEndpoint } from '@framework/api/endpoints/payments/constants'
import { ENABLE_SECURED_PAYMENT_PAYLOAD } from './constants'

export const LOG_REQUEST_OPTIONS = false
export const TEST_PAYMENT_AMOUNT_FORMATTED = `${TEST_PAYMENT_AMOUNT}`

export module Payments {
  export const PARSE_ORDER_ID_REGEX =
    /Order[ ](.*?)(?:[a-zA-Z0-9\-]*)for[ ]basket (.*)(?:[a-zA-Z0-9\-]*)/g
  export const CHECKOUT_FRAMES_SCRIPT_SRC_V2 =
    'https://cdn.checkout.com/js/framesv2.min.js'
  export const KLARNA_FRAMES_SCRIPT_SRC_V1 =
    'https://x.klarnacdn.net/kp/lib/v1/api.js'
  export const CLEARPAY_SCRIPT_SRC = 'afterpay.js'

  export const APPLE_PAY_VERSION = 6
  export const APPLE_PAY_SCRIPT_SRC_V1 =
    'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js'
  export const APPLE_PAY_MERCHANT_ID = 'merchant.com.commerce.ffx'
  export const APPLE_PAY_SUPPORTED_NETWORKS = [
    'visa',
    'masterCard' /*, 'amex', 'discover',*/,
  ]
  export const APPLE_PAY_MERCHANT_CAPABILITIES = [
    'supports3DS' /*, 'supportsEMV', 'supportsCredit', 'supportsDebit'*/,
  ]
  export const APPLE_PAY_REQUIRED_BILLING_CONTACT_FIELDS = [
    'phone',
    'postalAddress',
    'name',
    'email',
  ]
  export const APPLE_PAY_REQUIRED_SHIPPING_CONTACT_FIELDS = [
    'phone',
    'name',
    'email',
  ]

  export module RequestParams {
    export const B2B_COMPANY_DETAILS: any = {
      t: BCPaymentEndpoint.B2B_COMPANY_DETAILS,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const CONVERT_ORDER: any = {
      t: BCPaymentEndpoint.CONVERT_ORDER,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const INIT_PAYMENT: any = {
      t: BCPaymentEndpoint.INIT_PAYMENT,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const REQUEST_PAYMENT: any = {
      t: BCPaymentEndpoint.REQUEST_PAYMENT,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const CREATE_ONE_TIME_PAY_ORDER: any = {
      t: BCPaymentEndpoint.CREATE_ONE_TIME_PAY_ORDER,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const PROCESS_PAYMENT_RESPONSE: any = {
      t: BCPaymentEndpoint.PAYMENT_RESPONSE,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const PROCESS_PAYMENT_WEBHOOK: any = {
      t: BCPaymentEndpoint.PAYMENT_WEBHOOK,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const VALIDATE_PAYMENT_SESSION: any = {
      t: BCPaymentEndpoint.VALIDATE_PAYMENT_SESSION,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }

    export const REQUEST_TOKEN: any = {
      t: BCPaymentEndpoint.REQUEST_TOKEN,
      s: ENABLE_SECURED_PAYMENT_PAYLOAD ? 1 : 0,
    }
  }
}

export module JusPay {
  export enum TransactionStatus {
    TXN_CHARGED = 'TXN_CHARGED',
    TXN_FAILED = 'TXN_FAILED',
    ORDER_REFUNDED = 'ORDER_REFUNDED',
  }

  export enum UPI {
    PAYMENT_METHOD_TYPE = 'UPI',
    PAYMENT_METHOD = 'UPI',
    TRANSACTION_TYPE = 'UPI_COLLECT',
  }

  export module Offers {
    export const ELIGIBLE_OFFER_STATUS = 'ELIGIBLE'

    export enum CalculationRuleType {
      PERCENTAGE = 'PERCENTAGE',
      ABSOLUTE = 'ABSOLUTE',
    }
  }
}

export module LocalStorage {
  export module Key {
    export const ORDER_RESPONSE = 'orderResponse'
    export const ORDER_PAYMENT = 'orderModelPayment'
    export const CONVERTED_ORDER = 'convertedOrder'
    export const PREFERRED_PAYMENT = 'prefPay'
    export const DELIVERY_ADDRESS = 'delAddr'
    export const RECENTLY_VIEWED = 'recVwdProds'
    export const PAGE_SCROLL = 'pscr'
  }
}

export enum PaymentStatus {
  PENDING = 0,
  AUTHORIZED = 1,
  PAID = 2,
  DECLINED = 3,
  CANCELLED = 4,
  CANCELLED_BY_PSP = 5,
  REFUNDED = 6,
  CHARGING = 7,
  VOIDED = 8,
  REQUIRE_PRE_AUTH = 9,
  PROBLEM_IN_REFUND = 10,
  PROBLEM_IN_POST_AUTH = 11,
  AWAITING_POST_AUTH_RESPONSE = 12,
  REQUEST_TO_CANCEL_PRE_AUTH = 13,
  PROBLEM_IN_CANCEL_PRE_AUTH = 14,
  PO_RECEIVED = 15,
}

export enum CheckoutPaymentMethodType {
  CARD = 'CARD',
  NETBANKING = 'NB',
  WALLET = 'WALLET',
  UPI = 'UPI',
  COD = 'CODGoKwik',
  DIFFERENT_PAY_MODE = 'UseDifferentMethod',
  PAYER_ACCOUNT = 'PAYER_ACCOUNT',
}

export enum PaymentMethodMode {
  CARD = 1,
  NETBANKING = 2,
  WALLET = 3,
  UPI = 4,
  COD = 5,
}

export const CARD_TYPES = [
  'RUPAY',
  'VISA',
  'MASTER',
  'MAESTRO',
  'DINERS',
  'AMEX',
]
