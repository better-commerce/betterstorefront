import { EmptyGuid, EmptyString } from "@components/utils/constants";
import { AnalyticsEventType } from "..";

export const OMNILYTICS_EVENTS: any = {

    /**
     * All events supported for Omnilytics tracking
     */
    eventTypes: {
        [AnalyticsEventType.ADD_TO_BASKET]: 'BasketItemAdded', //
        [AnalyticsEventType.REMOVE_FROM_CART]: 'BasketItemRemoved', //
        [AnalyticsEventType.VIEW_BASKET]: 'BasketViewed', //
        [AnalyticsEventType.BRAND_VIEWED]: 'BrandViewed',
        [AnalyticsEventType.CATEGORY_VIEWED]: 'CategoryViewed',
        [AnalyticsEventType.CHECKOUT_CONFIRMATION]: 'CheckoutConfirmation',
        [AnalyticsEventType.BEGIN_CHECKOUT]: 'CheckoutStarted', //
        [AnalyticsEventType.CMS_PAGE_VIEWED]: 'CmsPageViewed',
        [AnalyticsEventType.VIEW_PLP_ITEMS]: 'CollectionViewed', //
        [AnalyticsEventType.CUSTOMER_CREATED]: 'CustomerCreated',
        [AnalyticsEventType.CUSTOMER_PROFILE_VIEWED]: 'CustomerProfileViewed',
        [AnalyticsEventType.CUSTOMER_UPDATED]: 'CustomerUpdated',
        [AnalyticsEventType.FACET_SEARCH]: 'FacetSearch',
        [AnalyticsEventType.FAQ_VIEWED]: 'FaqViewed',
        [AnalyticsEventType.FREE_TEXT]: 'FreeText',
        [AnalyticsEventType.PAGE_VIEWED]: 'PageViewed',
        [AnalyticsEventType.ORDER_PAGE_VIEWED]: 'OrderPageViewed',
        [AnalyticsEventType.PDP_VIEW]: 'ProductViewed', //
        [AnalyticsEventType.SEARCH]: 'Search',
        [AnalyticsEventType.PASSWORD_PROTECTION]: 'PasswordProtection',
        [AnalyticsEventType.VIEW_WISHLIST]: 'Wishlist', //
    },

    // Event mappings for Omnilytics
    events: {

        /**
         * Event: Page Viewed
         */
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
            },
        },

        /**
         * Event: Brand Viewed
         */
        [AnalyticsEventType.BRAND_VIEWED]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.brandDetails?.id,
                    name: source?.brandDetails?.name || EmptyString,
                    manufName: source?.brandDetails?.manufacturerName,
                })),
                entityName: (source: any) => source?.entityName,
                pageTitle: (source: any) => source?.brandDetails?.manufacturerName,
                entityType: 'Brand',
                eventType: 'BrandViewed',
            },
        },

        /**
         * Event: Shop All Brand Viewed
         */
        [AnalyticsEventType.SHOP_ALL_BRAND_VIEWED]: {
            transformMap: {
                eventType: AnalyticsEventType.BRAND_VIEWED,
                pageTitle: 'Brands',
            }
        },

        /**
         * Event: Category Viewed
         */
        [AnalyticsEventType.CATEGORY_VIEWED]: {
            transformMap: {
                entity: (source: any) => (source?.category ? JSON.stringify({
                    id: source?.category?.id,
                    name: source?.category?.name || EmptyString,
                }) : EmptyString),
                entityId: (source: any) => source?.category ? (source?.category?.id || EmptyGuid) : EmptyString,
                entityName: (source: any) => source?.entityName,
                entityType: (source: any) => source?.entityType,
                eventType: AnalyticsEventType.CATEGORY_VIEWED,
            },
        },
    }
}