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
  ADMIN = 1,
}

export enum CheckoutStep {
  NONE = '',
  LOGIN = 'login',
  ADDRESS = 'address',
  NEW_ADDRESS = 'new-address',
  EDIT_ADDRESS = 'edit-address',
  BILLING_ADDRESS = 'billing-address',
  DELIVERY = 'delivery',
  REVIEW = 'review',
}