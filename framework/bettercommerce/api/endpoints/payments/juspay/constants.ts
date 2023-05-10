export enum JusPayEndpoint {
    // Customer
    CREATE_CUSTOMER = "createCustomer",
    GET_CUSTOMER = "getCustomer",

    // Order
    GET_ORDER = "getOrder",
    CREATE_ORDER = "createOrder",
    UPDATE_ORDER = "updateOrder",

    // Payments
    TOKENIZE_CARD = "tokenizeCard",
    SAVE_CARD = "saveCreditDebitCard",
    DELETE_CARD = "deleteCreditDebitCard",
    LIST_CARDS = "listCards",
    CREDIT_DEBIT_CARD_PAYMENT = "creditDebitCardPayment",
    NETBANKING_PAYMENT = "netBankingPayment",
    WALLET_PAYMENT = "walletPayment",
    UPI_INTENT_PAYMENT = "upiIntentPayment",
    GET_CARD_INFO = "getCardInfo",
    GET_PAYMENT_METHODS = "getPaymentMethods",
    GET_OFFERS = "getPaymentOffers",

    // UPI
    VERIFY_VPA = "verifyVPA",
    PAY_VIA_UPI = "payViaUPA",
}