import { AnalyticsEventType } from "..";

export const OMNILYTICS_EVENTS: any = {

    /**
     * All events supported for Omnilytics tracking
     */
    eventTypes: {
        [AnalyticsEventType.ADD_TO_BASKET]: 'BasketItemAdded',
        [AnalyticsEventType.REMOVE_FROM_CART]: 'BasketItemRemoved',
        [AnalyticsEventType.VIEW_BASKET]: 'BasketViewed',
        [AnalyticsEventType.BRAND_VIEWED]: 'BrandViewed',
        [AnalyticsEventType.CATEGORY_VIEWED]: 'CategoryViewed',
        [AnalyticsEventType.CHECKOUT_CONFIRMATION]: 'CheckoutConfirmation',
        [AnalyticsEventType.BEGIN_CHECKOUT]: 'CheckoutStarted',
        [AnalyticsEventType.CMS_PAGE_VIEWED]: 'CmsPageViewed',
        [AnalyticsEventType.VIEW_PLP_ITEMS]: 'CollectionViewed',
        [AnalyticsEventType.CUSTOMER_CREATED]: 'CustomerCreated',
        [AnalyticsEventType.CUSTOMER_PROFILE_VIEWED]: 'CustomerProfileViewed',
        [AnalyticsEventType.CUSTOMER_UPDATED]: 'CustomerUpdated',
        [AnalyticsEventType.FACET_SEARCH]: 'FacetSearch',
        [AnalyticsEventType.FAQ_VIEWED]: 'FaqViewed',
        [AnalyticsEventType.FREE_TEXT]: 'FreeText',
        [AnalyticsEventType.PAGE_VIEWED]: 'PageViewed',
        [AnalyticsEventType.ORDER_PAGE_VIEWED]: 'OrderPageViewed',
        [AnalyticsEventType.PDP_VIEW]: 'ProductViewed',
        [AnalyticsEventType.SEARCH]: 'Search',
        [AnalyticsEventType.PASSWORD_PROTECTION]: 'PasswordProtection',
        [AnalyticsEventType.VIEW_WISHLIST]: 'Wishlist',
    },

    // Event mappings for Omnilytics
    events: {

        [AnalyticsEventType.PAGE_VIEWED]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: '',
                    name: source?.metatitle,
                    metaTitle: source?.metaTitle,
                    MetaKeywords: source?.metaKeywords,
                    MetaDescription: source?.metaDescription,
                    Slug: source?.slug,
                    Title: source?.metatitle,
                    ViewType: 'Page View',
                })),
                entityName: (source: any) => source?.entityName,
                pageTitle: (source: any) => source?.metaTitle,
                entityType: 'Page',
                entityId: '',
                eventType: 'PageViewed',
            }
        },
    }
}