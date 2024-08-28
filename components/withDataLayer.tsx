import { useEffect } from 'react'
import DataLayerInstance, { KEYS_MAP } from '@components/utils/dataLayer'
import Layout from '@components/Layout/Layout'

export const PAGE_TYPES = {
  Blog: 'blog',
  Brand: 'brand',
  Category: 'category',
  Checkout: 'checkout',
  Common: 'common',
  Home: 'home',
  Page: 'page',
  Product: 'product',
  Search: 'search',
  Cookie: 'cookie',
  Contact: 'contact',
  Privacy: 'privacy',
  Terms: 'terms',
  Survey: 'survey',
  MyStore: 'my-store',
  MyStoreImproveRecommends: 'my-store-improve-recommendations',
  MyStoreRecommends: 'my-store-recommendations',
  MyMembership: 'my-membership',
  Membership: 'membership-detail',
  MyAccount: 'my-account',
  MyQuotes: 'my-quotes',
  MyOrders: 'my-orders',
  MyInvoices:'my-invoice',
  ShoppingList:'shopping-list',
  Login: 'login',
  SocialLogin: 'social-login',
  Register: 'register',
  ResetPassword: 'reset-password',
  ForgotPassword: 'forgot-password',
  AddressBook: 'address-book',
  ContactDetail: 'contact-detail',
  MyCompany: 'my-company',
  RequestQuote: 'requests-for-quote',
  ReferFriend: 'refer-friend',
  Wishlist: 'wishlist',
  Company: 'Company',
  BrandList: 'brand-list',
  CategoryList: 'category-list',
  SubCategoryList: 'sub-category-list',
  Collection: 'collection-home',
  CollectionList: 'collection-list',
  Cart: 'cart',
  Lookbook: 'lookbook-home',
  LookbookList: 'lookbook-list',
  StoreLocator: 'store-locator',
  StoreLocatorDetail: 'store-locator-detail',
  NotFound: 'not-found',
  InternalError: 'internal-error',
  PasswordProtection: 'password-protection',
  OrderList: 'order-list',
  OrderDetail: 'order-detail',
  OrderCancel: 'order-cancel-detail',
  OrderReturns: 'order-returns',
  OrderReturn: 'order-return-detail',

}
export default function withDataLayer(
  Component: any,
  pageType: string,
  showLayout = true,
  CustomLayout?: any
) {
  function WrappedComponent(props: any) {
    useEffect(() => {
      DataLayerInstance.setItemInDataLayer('pageCategory', pageType)
    }, [])

    const setEntities = (entities: any) => {
      DataLayerInstance.setEntities(entities)
    }
    const recordEvent = (event: string) =>
      DataLayerInstance.setItemInDataLayer(KEYS_MAP.eventType, event)

    return (
      <Component
        {...props}
        setEntities={setEntities}
        recordEvent={recordEvent}
      />
    )
  }

  if (showLayout) {
    if (CustomLayout) {
      WrappedComponent.Layout = CustomLayout
    } else {
      WrappedComponent.Layout = Layout
    }
  }
  return WrappedComponent
}
