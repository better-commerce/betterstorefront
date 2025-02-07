import { EmptyGuid, EmptyString } from "@components/utils/constants";
import { AnalyticsEventType } from "..";

export const OMNILYTICS_EVENTS: any = {

    /**
     * All events supported for Omnilytics tracking
     */
    eventTypes: {
        [AnalyticsEventType.ADD_TO_BASKET]: 'BasketItemAdded',
        [AnalyticsEventType.REMOVE_FROM_CART]: 'BasketItemRemoved',
        [AnalyticsEventType.VIEW_BASKET]: 'BasketViewed', //
        [AnalyticsEventType.ALL_BRANDS_VIEWED]: 'AllBrandsViewed',
        [AnalyticsEventType.BRAND_VIEWED]: 'BrandViewed',
        [AnalyticsEventType.CATEGORY_VIEWED]: 'CategoryViewed',
        [AnalyticsEventType.PURCHASE]: 'CheckoutConfirmation',
        [AnalyticsEventType.BEGIN_CHECKOUT]: 'CheckoutStarted', //
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
        [AnalyticsEventType.VIEW_WISHLIST]: 'Wishlist', //
    },

    // Event mappings for Omnilytics
    events: {

        /**
         * Event: Page Viewed
         */
        [AnalyticsEventType.PAGE_VIEWED]: {
            transformMap: {
                entity: (source: any) => ((source?.metatitle || source?.metaTitle) ? (JSON.stringify({
                    id: '',
                    name: source?.metatitle || source?.metaTitle,
                    metaTitle: source?.metatitle || source?.metaTitle,
                    MetaKeywords: source?.metaKeywords,
                    MetaDescription: source?.metaDescription,
                    Slug: source?.slug,
                    Title: source?.metatitle || source?.metaTitle,
                    ViewType: 'Page View',
                })) : EmptyString),
                entityName: (source: any) => source?.entityName || EmptyString,
                pageTitle: (source: any) => source?.metaTitle || EmptyString,
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
        [AnalyticsEventType.ALL_BRANDS_VIEWED]: {
            transformMap: {
                eventType: 'BrandViewed',
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
                eventType: 'CategoryViewed',
            },
        },

        /**
         * Event: Checkout Confirmation
         */
        [AnalyticsEventType.PURCHASE]: {
            transformMap: {
                basketItemCount: (source: any) => source?.cartItems?.lineItems?.length,
                basketTotal: (source: any) => source?.orderInfo?.orderResponse?.grandTotal?.raw?.withTax,
                shippingCost: (source: any) => source?.cartItems?.shippingCharge?.raw?.withTax,
                promoCodes: (source: any) => source?.cartItems?.promotionsApplied,
                basketItems: (source: any) => (JSON.stringify(
                    source?.cartItems?.lineItems?.length ? source?.cartItems?.lineItems?.map((i: any) => {
                        return {
                            categories: i?.categoryItems,
                            discountAmt: i?.discount?.raw?.withTax,
                            id: i?.id,
                            img: i?.image,
                            isSubscription: i?.isSubscription,
                            itemType: i?.itemType,
                            manufacturer: i?.manufacturer || EmptyString,
                            name: i?.name,
                            price: i?.price?.raw?.withTax,
                            productId: i?.productId,
                            qty: i?.qty,
                            rootManufacturer: i?.rootManufacturer || EmptyString,
                            stockCode: i?.stockCode,
                            subManufacturer: i?.subManufacturer,
                            tax: i?.totalPrice?.raw?.withTax,
                        }
                    }) : new Array<any>()
                )),
                entity: (source: any) => (JSON.stringify({
                    basketId: source?.basketId,
                    billingAddress: source?.orderInfo?.orderResponse?.billingAddress,
                    customerId: source?.orderInfo?.orderResponse?.customerId,
                    discount: source?.orderInfo?.orderResponse?.discount?.raw?.withTax,
                    grandTotal: source?.orderInfo?.orderResponse?.grandTotal?.raw?.withTax,
                    id: source?.orderInfo?.orderResponse?.id,
                    lineitems: source?.orderInfo?.orderResponse?.items || source?.cartItems?.lineItems,
                    orderNo: source?.orderInfo?.orderResponse?.orderNo,
                    paidAmount: source?.orderInfo?.orderResponse?.paidAmount?.raw?.withTax || source?.orderInfo?.orderResponse?.grandTotal?.raw?.withTax,
                    payments: source?.orderInfo?.orderResponse?.payments?.map((i: any) => ({
                        methodName: i.paymentMethod,
                        paymentGateway: i.paymentGateway,
                        amount: i.paidAmount,
                    })),
                    promoCode: source?.orderInfo?.orderResponse?.promotionsApplied,
                    shipCharge: source?.orderInfo?.orderResponse?.shippingCharge?.raw?.withTax || source?.cartItems?.shippingCharge?.raw?.withTax,
                    shippingAddress: source?.orderInfo?.orderResponse?.shippingAddress,
                    shippingMethod: source?.orderInfo?.orderResponse?.shipping,
                    status: source?.orderInfo?.orderResponse?.orderStatus,
                    subTotal: source?.orderInfo?.orderResponse?.subTotal?.raw?.withTax,
                    tax: source?.orderInfo?.orderResponse?.grandTotal?.raw?.withTax,
                    taxPercent: source?.orderInfo?.orderResponse?.taxPercent,
                    timestamp: source?.orderInfo?.orderResponse?.orderDate,
                })),
                entityId: (source: any) => source?.orderInfo?.orderResponse?.id,
                entityName: (source: any) => source?.orderInfo?.orderResponse?.orderNo,
                entityType: (source: any) => source?.entityType,
                eventType: 'CheckoutConfirmation',
            }
        },

        /**
         * Event: Customer Created
         */
        [AnalyticsEventType.CUSTOMER_CREATED]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.details?.recordId,
                    name: source?.details?.firstName + source?.details?.lastName,
                    email: source?.details?.email,
                })),
                eventType: 'CustomerCreated',
            },
        },

        /**
         * Event: Customer Profile Viewed
         */
        [AnalyticsEventType.CUSTOMER_PROFILE_VIEWED]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    email: source?.email,
                    dateOfBirth: source?.yearOfBirth,
                    gender: source?.gender,
                    id: source?.userId,
                    name: source?.firstName + source?.lastName,
                    postCode: source?.postCode,
                })),
                entityId: (source: any) => source?.userId,
                entityName: (source: any) => source?.firstName + source?.lastName,
                entityType: (source: any) => source?.entityType,
                eventType: 'CustomerProfileViewed',
            },
        },

        /**
         * Event: Customer Updated
         */
        [AnalyticsEventType.CUSTOMER_UPDATED]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.userId,
                    name: source?.username,
                    dateOfBirth: source?.yearOfBirth,
                    gender: source?.gender,
                    email: source?.email,
                    postCode: source?.postCode,
                })),
                entityId: (source: any) => source?.userId,
                entityName: (source: any) => source?.firstName + source?.lastName,
                eventType: 'CustomerUpdated',
            },
        },

        /**
         * Event: Facet Search
         */
        [AnalyticsEventType.FACET_SEARCH]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    FreeText: '',
                    Page: source?.currentPage,
                    SortBy: source?.sortBy,
                    SortOrder: source?.sortOrder,
                    Brand: source?.brand,
                    Category: source?.category,
                    Gender: source?.gender,
                    CurrentPage: source?.currentPage,
                    PageSize: 20,
                    Filters: source?.filters,
                    AllowFacet: true,
                    ResultCount: source?.products?.total,
                })),
                entityName: (source: any) => source?.entityName,
                pageTitle: 'Catalog',
                entityType: 'Page',
                eventType: 'Search',
            },
        },

        /**
         * Event: Faq Viewed
         */
        [AnalyticsEventType.FAQ_VIEWED]: {
            transformMap: {
            },
        },

        /**
         * Event: Order Page Viewed
         */
        [AnalyticsEventType.ORDER_PAGE_VIEWED]: {
            transformMap: {
                entityName: (source: any) => source?.entityName,
                entityType: (source: any) => source?.entityType,
                eventType: 'OrderPageViewed',
            },
        },

        /**
         * Event: Search
         */
        [AnalyticsEventType.SEARCH]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    FreeText: source?.inputValue,
                    ResultCount: source?.products?.length || 0,
                })),
                entityId: (source: any) => source?.inputValue,
                entityName: (source: any) => source?.inputValue,
                entityType: (source: any) => source?.entityType,
                eventType: 'Search',
            },
        },

        /**
         * Event: Password Protection
         */
        [AnalyticsEventType.PASSWORD_PROTECTION]: {
            transformMap: {
                entityName: (source: any) => source?.entityName,
                entityType: 'Page',
                eventType: 'PasswordProtection',
            },
        },

        /**
         * Event: View Basket
         */
        [AnalyticsEventType.VIEW_BASKET]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.cartItems?.id,
                    grandTotal: source?.cartItems?.grandTotal?.raw.withTax,
                    lineItems: source?.cartItems?.lineItems,
                    promoCode: source?.cartItems?.promotionsApplied,
                    shipCharge: source?.cartItems?.shippingCharge?.raw?.withTax,
                    shipTax: source?.cartItems?.shippingCharge?.raw?.tax,
                    taxPercent: source?.cartItems?.taxPercent,
                    tax: source?.cartItems?.grandTotal?.raw?.tax,
                })),
                entityName: 'Cart',
                entityType: (source: any) => source?.entityType,
                eventType: 'BasketViewed',
                promoCodes: (source: any) => source?.cartItems?.promotionsApplied,
            },
        },

        /**
         * Event: Product Viewed
         */
        [AnalyticsEventType.PDP_VIEW]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.recordId,
                    sku: source?.sku,
                    name: source?.name,
                    stockCode: source?.stockCode,
                    img: source?.image,
                })),
                entityId: (source: any) => source?.recordId,
                entityName: (source: any) => source?.name,
                entityType: (source: any) => source?.entityType,
                eventType: 'ProductViewed',
                omniImg: (source: any) => source?.image,
            },
        },

        /**
         * Event: Add To Basket
         */
        [AnalyticsEventType.ADD_TO_BASKET]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    basketId: source?.cartItems?.id,
                    id: source?.productId || source?.recordId,
                    name: source?.name,
                    price: source?.price?.raw?.withTax,
                    quantity: 1,
                    stockCode: source?.stockCode,
                })),
                basketItems: (source: any) => (source?.cartItems?.lineItems?.length ? JSON.stringify(
                    source?.cartItems?.lineItems?.map((obj: any) => {
                        return {
                            basketId: source?.cartItems?.id,
                            id: obj?.id,
                            img: obj?.image,
                            name: obj?.name,
                            price: obj?.price?.raw?.withTax,
                            qty: obj?.qty,
                            stockCode: obj?.stockCode,
                            tax: obj?.price?.raw?.tax,
                        }
                    })
                ) : JSON.stringify(new Array<any>())),
                basketItemCount: (source: any) => source?.cartItems?.lineItems?.length || 0,
                basketTotal: (source: any) => source?.cartItems?.grandTotal?.raw?.withTax,
                entityId: (source: any) => source?.recordId,
                entityType: 'product',
                eventType: 'BasketItemAdded',
                entityName: (source: any) => source?.name,
            },
        },

        [AnalyticsEventType.REMOVE_FROM_CART]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    basketId: source?.cartItems?.id,
                    id: source?.productId || source?.recordId,
                    name: source?.name,
                    price: source?.price?.raw?.withTax,
                    quantity: 1,
                    stockCode: source?.stockCode,
                })),
                basketItems: (source: any) => (source?.cartItems?.lineItems?.length ? JSON.stringify(
                    source?.cartItems?.lineItems?.map((obj: any) => {
                        return {
                            basketId: source?.cartItems?.id,
                            id: obj?.id,
                            img: obj?.image,
                            name: obj?.name,
                            price: obj?.price?.raw?.withTax,
                            qty: obj?.qty,
                            stockCode: obj?.stockCode,
                            tax: obj?.price?.raw?.tax,
                        }
                    })
                ) : JSON.stringify(new Array<any>())),
                basketItemCount: (source: any) => source?.cartItems?.lineItems?.length || 0,
                basketTotal: (source: any) => source?.cartItems?.grandTotal?.raw?.withTax,
                entityId: (source: any) => source?.recordId,
                entityType: (source: any) => source?.entityType,
                eventType: 'BasketItemRemoved',
                entityName: (source: any) => source?.name,
            },
        },

        /**
         * Event: Begin Checkout
         */
        [AnalyticsEventType.BEGIN_CHECKOUT]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.cartItems?.id,
                    basketId: source?.cartItems?.id,
                    customerId: source?.cartItems?.userId,
                    grandTotal: source?.cartItems?.grandTotal?.raw?.withTax,
                    tax: source?.cartItems?.grandTotal?.raw?.tax,
                    taxPercent: source?.cartItems?.taxPercent,
                    shipCharge: source?.cartItems?.shippingCharge?.raw?.withoutTax,
                    shipTax: source?.cartItems?.shippingCharge?.raw?.tax,
                    subTotal: source?.cartItems?.subTotal?.raw?.withoutTax,
                    discount: source?.cartItems?.discount?.raw?.withoutTax,
                    lineitems: source?.cartItems?.lineItems?.map((lineitem: any) => ({
                        id: lineitem?.id,
                        manufacturer: lineitem?.manufacturer,
                        subManufacturer: lineitem?.subManufacturer,
                        productId: lineitem?.productId,
                        stockCode: lineitem?.stockCode,
                        name: lineitem?.name,
                        discountAmt: lineitem?.discountAmt?.raw?.withoutTax || lineitem?.discount?.raw?.withoutTax || 0,
                        isSubscription: lineitem?.isSubscription,
                        itemType: lineitem?.itemType,
                        qty: lineitem?.qty,
                        price: lineitem?.price?.raw?.withoutTax,
                        tax: lineitem?.price?.raw?.tax,
                        categories: lineitem?.categoryItems?.map((category: any) => ({
                            categoryId: category?.categoryId,
                            categoryName: category?.categoryName,
                            parentCategoryName: category?.parentCategoryName,
                        })),
                        img: lineitem?.img || lineitem?.image,
                        rootManufacturer: lineitem?.categoryItems?.find((category: any) => !category?.parentCategoryName)?.categoryName,
                    })) || new Array<any>(),
                    promoCode: source?.cartItems?.promotionsApplied || new Array<any>(),
                    paidAmount: source?.cartItems?.grandTotal?.raw?.withTax,
                    shippingAddress: source?.cartItems?.shippingAddress,
                    billingAddress: source?.cartItems?.billingAddress,
                })),
                promoCodes: (source: any) => JSON.stringify(source?.cartItems?.promotionsApplied),
                entityId: (source: any) => source?.cartItems?.id,
                entityName: (source: any) => source?.entityName,
                entityType: 'Basket',
                eventType: 'CheckoutStarted',
            },
        },

        /**
         * Event: View PLP Items
         */
        [AnalyticsEventType.VIEW_PLP_ITEMS]: {
            transformMap: {
                entity: (source: any) => (JSON.stringify({
                    id: source?.plpDetails?.id || EmptyGuid,
                    name: source?.plpDetails?.name || EmptyString,
                })),
                entityId: (source: any) => source?.plpDetails?.id || EmptyGuid,
                entityName: (source: any) => source?.plpDetails?.name || EmptyString,
                entityType: (source: any) => source?.entityType,
                eventType: 'CollectionViewed',
            },
        },
    },
}