export enum BCPaymentEndpoint {
  CONVERT_ORDER = 'co',
  INIT_PAYMENT = 'ip',
  REQUEST_PAYMENT = 'rp',
  CREATE_ONE_TIME_PAY_ORDER = 'cotpo', // for Klarna
  PAYMENT_RESPONSE = 'pr',
  PAYMENT_WEBHOOK = 'pwh',
  B2B_COMPANY_DETAILS = 'cd',
  VALIDATE_PAYMENT_SESSION = 'vps', // for ApplePay
  REQUEST_TOKEN = 'rt', // for Checkout, ApplePay
}

export enum PayPalOrderIntent {
  // The merchant intends to capture payment immediately after the customer makes a payment.
  CAPTURE = 'CAPTURE',

  // The merchant intends to authorize a payment and place funds on hold after the customer makes a payment. Authorized payments are best captured within three days of authorization but are available to capture for up to 29 days. After the three-day honor period, the original authorized payment expires and you must re-authorize the payment. You must make a separate request to capture payments on demand. This intent is not supported when you have more than one purchase_unit within your order.
  AUTHORIZE = 'AUTHORIZE',
}
