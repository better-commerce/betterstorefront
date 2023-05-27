
import { stringToBoolean } from "@framework/utils/parse-util";
import { JusPayEndpoint } from "@framework/api/endpoints/payments/juspay/constants";
import { IS_TEST_PAYMENT_ENABLED_ON_LIVE, TEST_PAYMENT_AMOUNT } from "@framework/utils/constants";
import { PayPalEndpoint } from "@framework/api/endpoints/payments/paypal/constants";
import { SECURE_PAYMENT_METHODS_SETTINGS_FIELDS } from "./constants";

export const LOG_REQUEST_OPTIONS = true;
export const TEST_PAYMENT_AMOUNT_FORMATTED = `₹${TEST_PAYMENT_AMOUNT}`;

export enum PaymentGateway {
  JUSPAY = "juspay",
  PAYPAL = "paypal",
};

export module JusPay {
  export module RequestParams {

    export const GET_PAYMENT_METHODS: any = {
      type: JusPayEndpoint.GET_PAYMENT_METHODS,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
      options: {
        add_outage: false,
      },
    };

    export const GET_OFFERS: any = {
      type: JusPayEndpoint.GET_OFFERS,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const GET_CARD_BIN: any = {
      type: JusPayEndpoint.GET_CARD_INFO,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const GET_CUSTOMER: any = {
      type: JusPayEndpoint.GET_CUSTOMER,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const CREATE_CUSTOMER: any = {
      type: JusPayEndpoint.CREATE_CUSTOMER,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const TOKENIZE_CARD: any = {
      type: JusPayEndpoint.TOKENIZE_CARD,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const SAVE_CARD: any = {
      type: JusPayEndpoint.SAVE_CARD,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const DELETE_CARD: any = {
      type: JusPayEndpoint.DELETE_CARD,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const LIST_CARDS: any = {
      type: JusPayEndpoint.LIST_CARDS,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const CREDIT_DEBIT_CARD_PAYMENT: any = {
      type: JusPayEndpoint.CREDIT_DEBIT_CARD_PAYMENT,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const NETBANKING_PAYMENT: any = {
      type: JusPayEndpoint.NETBANKING_PAYMENT,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const WALLET_PAYMENT: any = {
      type: JusPayEndpoint.WALLET_PAYMENT,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const UPI_INTENT_PAYMENT: any = {
      type: JusPayEndpoint.UPI_INTENT_PAYMENT,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const GET_ORDER: any = {
      type: JusPayEndpoint.GET_ORDER,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const CREATE_ORDER: any = {
      type: JusPayEndpoint.CREATE_ORDER,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const UPDATE_ORDER: any = {
      type: JusPayEndpoint.UPDATE_ORDER,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const VERIFY_VPA: any = {
      type: JusPayEndpoint.VERIFY_VPA,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };

    export const PAY_VIA_UPI: any = {
      type: JusPayEndpoint.PAY_VIA_UPI,
      testMode: stringToBoolean(IS_TEST_PAYMENT_ENABLED_ON_LIVE),
    };
  };

  export enum TransactionStatus {
    TXN_CHARGED = "TXN_CHARGED",
    TXN_FAILED = "TXN_FAILED",
    ORDER_REFUNDED = "ORDER_REFUNDED",
  }

  export enum PaymentStatus {
    AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED", // UPI
    PENDING = "PENDING_VBV", // Card
    VBV_SUCCESSFUL = "VBV_SUCCESSFUL",
    CHARGED = "CHARGED",
    JUSPAY_DECLINED = "JUSPAY_DECLINED",
    AUTO_REFUNDED = "AUTO_REFUNDED",
    CAPTURE_FAILED = "CAPTURE_FAILED",
    NOT_FOUND = "NOT_FOUND",
    AUTHORIZING = "AUTHORIZING",
    STARTED = "STARTED",
    CAPTURE_INITIATED = "CAPTURE_INITIATED",
  };

  export enum UPI {
    PAYMENT_METHOD_TYPE = "UPI",
    PAYMENT_METHOD = "UPI",
    TRANSACTION_TYPE = "UPI_COLLECT",
  };

  export module Offers {
    export const ELIGIBLE_OFFER_STATUS = "ELIGIBLE";

    export enum CalculationRuleType {
      PERCENTAGE = "PERCENTAGE",
      ABSOLUTE = "ABSOLUTE",
    }
  };
};

export module PayPal {
  export const PARSE_ORDER_ID_REGEX = /Order[ ](.*?)(?:[a-zA-Z0-9\-]*)for[ ]basket (.*)(?:[a-zA-Z0-9\-]*)/g;

  export module RequestParams {

    export const CREATE_PAYMENT: any = {
      t: PayPalEndpoint.CREATE_PAYMENT,
      s: SECURE_PAYMENT_METHODS_SETTINGS_FIELDS ? 1 : 0,
    };

    export const GET_PAYMENT_DETAILS: any = {
      t: PayPalEndpoint.GET_PAYMENT_DETAILS,
      s: SECURE_PAYMENT_METHODS_SETTINGS_FIELDS ? 1 : 0,
    };

    export const EXECUTE_PAYMENT: any = {
      t: PayPalEndpoint.EXECUTE_PAYMENT,
      s: SECURE_PAYMENT_METHODS_SETTINGS_FIELDS ? 1 : 0,
    };
  }
};

export module LocalStorage {
  export module Key {
    export const ORDER_RESPONSE = "orderResponse";
    export const ORDER_PAYMENT = "orderModelPayment";
    export const CONVERTED_ORDER = "convertedOrder";
    export const PREFERRED_PAYMENT = "prefPay";
    export const DELIVERY_ADDRESS = "delAddr";
  };
};

export enum PaymentOrderStatus {
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
};

export enum PaymentMethodType {
  CARD = "CARD",
  NETBANKING = "NB",
  WALLET = "WALLET",
  UPI = "UPI",
  COD = "CODGoKwik",
  DIFFERENT_PAY_MODE = "UseDifferentMethod",
  PAYER_ACCOUNT = "PAYER_ACCOUNT",
}

export enum PaymentMethodMode {
  CARD = 1,
  NETBANKING = 2,
  WALLET = 3,
  UPI = 4,
  COD = 5,
}

export const CARD_TYPES = ["RUPAY", "VISA", "MASTER", "MAESTRO", "DINERS", "AMEX"];