export const EVENTS_MAP = {
  // EVENT_TYPES: {
  //   BasketItemAdded: 'BasketItemAdded',
  //   BasketItemRemoved: 'BasketItemRemoved',
  //   BasketViewed: 'BasketViewed',
  //   BrandViewed: 'BrandViewed',
  //   CategoryViewed: 'CategoryViewed',
  //   CheckoutConfirmation: 'CheckoutConfirmation',
  //   CheckoutStarted: 'CheckoutStarted',
  //   CmsPageViewed: 'CmsPageViewed',
  //   CollectionViewed: 'CollectionViewed',
  //   CustomerCreated: 'CustomerCreated',
  //   CustomerProfileViewed: 'CustomerProfileViewed',
  //   CustomerUpdated: 'CustomerUpdated',
  //   FacetSearch: 'FacetSearch',
  //   FaqViewed: 'FaqViewed',
  //   FreeText: 'FreeText',
  //   PageViewed: 'PageViewed',
  //   OrderPageViewed: 'OrderPageViewed',
  //   ProductViewed: 'ProductViewed',
  //   Search: 'Search',
  //   PasswordProtection: 'PasswordProtection',
  //   Wishlist: 'Wishlist',
  // },
  ENTITY_TYPES: {
    Basket: 'Basket',
    Blog: 'Blog',
    Brand: 'Brand',
    Category: 'Category',
    CmsPage: 'CmsPage',
    Collection: 'Collection',
    Customer: 'Customer',
    Order: 'Order',
    Page: 'Page',
    Product: 'Product',
    Search: 'Search',
    user: 'user',
  },
  PAGE_CATEGORIES: [
    'Account',
    'B2B',
    'Basket',
    'Blog',
    'Brand',
    'Category',
    'Checkout',
    'Common',
    'Home',
    'Page',
    'Product',
    'Search',
    'Survey',
  ],
  CHANNEL_TYPES: ['Web', 'Mobile', 'App', 'Phone', 'Store'],
}

export enum CUSTOM_EVENTS {
  ProductViewed = 'ProductViewedData',
}
