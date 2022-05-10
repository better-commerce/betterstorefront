// Base Imports
import React, { memo, useEffect } from "react";

// Other Imports
import { injectSnippets, SnippetContentType, SnippetPlacementType } from "@components/common/Content/ContentSnippet";

export enum WebhookEventType {

    BASKET_ITEM_ADDED = "BasketItemAdded",
    BASKET_ITEM_REMOVED = "BasketItemRemoved",
    BASKET_CHECKOUT = "BasketCheckout",
    BASKET_VIEWED = "BasketViewed",
    CHECKOUT_STARTED = "CheckoutStarted",
    CHECKOUT_ADDRESS = "CheckoutAddress",
    CHECKOUT_PAYMENT = "CheckoutPayment",
    CHECKOUT_CONFIRMATION = "CheckoutConfirmation",

    ORDER_CREATED = "OrderCreated",
    ORDER_UPDATED = "OrderUpdated",
    PAID = "Paid",

    PRODUCT_CREATED = "ProductCreated",
    PRODUCT_UPDATED = "ProductUpdated",
    PRODUCT_DELETED = "ProductDeleted",
    PRODUCT_VIEWED = "ProductViewed",
    RECOMMENDATION_VIEWED = "RecommendationViewed",

    CUSTOMER_CREATED = "CustomerCreated",
    CUSTOMER_UPDATED = "CustomerUpdated",
    CUSTOMER_LOGIN_SUCCES = "CustomerLoginSucces",
    CUSTOMER_LOGIN_FAILURE = "CustomerLoginFailure",
    CUSTOMER_PROFILE_VIEWED = "CustomerProfileViewed",

    SESSION_CREATED = "SessionCreated",
    SESSION_UPDATED = "SessionUpdated",

    BRAND_VIEWED = "BrandViewed",

    SUB_BRAND_VIEWED = "SubbrandViewed",

    COLLECTION_VIEWED = "CollectionViewed",

    CATEGORY_VIEWED = "CategoryViewed",

    FREE_TEXT = "FreeText",
    FACET_SEARCH = "FacetSearch",

    BLOG_VIEWED = "BlogViewed",
    CMS_PAGE_VIEWED = "CmsPageViewed",
    PAGE_VIEWED = "PageViewed",
    FAQ_VIEWED = "FaqViewed",
}

interface IDataLayerProps {
    readonly slugs: any;
    readonly entityName: string;
    readonly entityType: string;
    readonly eventType: string;
}

const DataLayerSnippet: React.FC<IDataLayerProps> = (props: IDataLayerProps) => {
    const { slugs, entityName, entityType, eventType } = props;
    const entity = [
        {
            eventType: eventType,
            entityId: slugs?.id,
            entityName: entityName,
            entity: {
                id: slugs?.id,
                name: slugs?.name,
                metaTitle: slugs?.metaTitle,
                MetaKeywords: slugs?.metaKeywords,
                MetaDescription: slugs?.metaDescription,
                slug: slugs?.slug,
                title: slugs?.title,
                viewType: slugs?.viewType,
            },
            entityType: entityType
        }
    ];

    const snippet = {
        content: `<script>var entity = ${JSON.stringify(entity)}</script>`,
        name: "DataLayers_Entity",
        placement: SnippetPlacementType.HEAD_BEFORE_CLOSE,
        type: SnippetContentType.JAVASCRIPT
    };

    useEffect(() => {
        injectSnippets([snippet]);
    }, []);

    return (
        <></>
    );
}

export default memo(DataLayerSnippet);