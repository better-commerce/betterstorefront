export enum BundleType {
  BOM = 0,
  COMPLEMENTARY = 1,
}

export enum AddressType {
  SHIPPING = 0,
  BILLING = 1,
}

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
}
export enum SearchProvider {
  DEFAULT = 'default',
  ELASTIC = 'elastic',
  ALGOLIA = 'algolia',
}

export enum UserRoleType {
  NONE = 0,
  ADMIN = 1,
  SALES_USER = 2,
  USER = 3,
}

export enum CheckoutStep {
  NONE = '',
  LOGIN = 'login',
  ADDRESS = 'address',
  NEW_ADDRESS = 'new-address',
  EDIT_ADDRESS = 'edit-address',
  BILLING_ADDRESS = 'billing-address',
  DELIVERY = 'delivery',
  DELIVERY_TYPE_SELECT = 'select-delivery-type',
  REVIEW = 'review',
}
