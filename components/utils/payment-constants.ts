import { TEST_PAYMENT_AMOUNT } from '@framework/utils/constants'
import { BCPaymentEndpoint } from '@framework/api/endpoints/payments/constants'
import { ENABLE_SECURED_PAYMENT_PAYLOAD } from './constants'

export const LOG_REQUEST_OPTIONS = false
export const TEST_PAYMENT_AMOUNT_FORMATTED = `₹${TEST_PAYMENT_AMOUNT}`

export enum PaymentMethodType {
  COD = 'cod',
  JUSPAY = 'juspay',
  PAYPAL = 'paypal',
  CHECKOUT = 'checkout',
  MASTER_CARD = 'mastercard',
  CLEAR_PAY = 'clearpay',
  KLARNA = 'klarna',
  STRIPE = 'stripe',
  ACCOUNT_CREDIT = 'accountcredit',
  CHEQUE = 'cheque',
}

export enum PaymentMethodTypeId {
  COD = 0,
  JUSPAY = 1,
  PAYPAL = 2,
  CHECKOUT = 3,
  MASTER_CARD = 4,
  CLEAR_PAY = 5,
  KLARNA = 6,
  STRIPE = 7,
  ACCOUNT_CREDIT = 8,
  CHEQUE = 9,
}

export module Payments {
  export const PARSE_ORDER_ID_REGEX =
    /Order[ ](.*?)(?:[a-zA-Z0-9\-]*)for[ ]basket (.*)(?:[a-zA-Z0-9\-]*)/g
  export const CHECKOUT_FRAMES_SCRIPT_SRC_V2 =
    'https://cdn.checkout.com/js/framesv2.min.js'
  export const KLARNA_FRAMES_SCRIPT_SRC_V1 =
    'https://x.klarnacdn.net/kp/lib/v1/api.js'
  export const CLEARPAY_SCRIPT_SRC = 'afterpay.js'

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
