export enum PayPalEndpoint {
    CREATE_PAYMENT = "cp",
    GET_PAYMENT_DETAILS = "gpd",
    EXECUTE_PAYMENT = "ep",
};

export enum PayPalPaymentIntent {
    SALE = "sale",
    AUTHORIZE = "authorize",
    ORDER = "order",
};

export enum PayPalPaymentState {
    CREATED = "created",
    APPROVED = "approved",
    FAILED = "failed",
}
