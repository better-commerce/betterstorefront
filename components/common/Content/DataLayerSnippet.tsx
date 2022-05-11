// Base Imports
import React, { memo, useEffect } from "react";

// Other Imports
import { EVENTS_MAP } from "@components/services/analytics/constants";
import { injectSnippets, SnippetContentType, SnippetPlacementType } from "@components/common/Content/ContentSnippet";

interface IDataLayerProps {
    readonly entityObject: any;
    readonly entityName: string;
    readonly entityType: string;
    readonly eventType: string;
}

const DataLayerSnippet: React.FC<IDataLayerProps> = (props: IDataLayerProps) => {
    let entity: Array<any> = new Array();
    const { Basket, Blog, Brand, Category, CmsPage, Collection, Customer, Order, Page, Product, Search } = EVENTS_MAP.ENTITY_TYPES;
    const { entityObject, entityName, entityType, eventType } = props;

    // TODO: Initialize entity object based on entity type and entity object.
    if (entityType === Basket) { //BasketModel
    } else if (entityType === Blog) { // BlogDetailViewModel
    } else if (entityType === Brand) { // BrandDetailModel
    } else if (entityType === Category) { // CategoryModel
    } else if (entityType === CmsPage) { // SiteViewModel
    } else if (entityType === Collection) { // DynamicListCollection
    } else if (entityType === Customer) { // CustomerProfileModel
    } else if (entityType === Order) { // OrderModel
    } else if (entityType === Product) { // ProductDetailModel
    } else if (entityType === Search) { // SearchRequestModel
        /*entity = [
            {
                eventType: "FreeText",
                entityId: "jacket",
                entityName: "jacket",
                entity: {
                    freeText: "jacket",
                    page: 1,
                    sortBy: null,
                    sortOrder: null,
                    collectionId: null,
                    collection: null,
                    brandId: null,
                    excludedBrandIds: null,
                    brand: null,
                    facet: null,
                    categoryId: null,
                    categoryIds: null,
                    excludedCategoryIds: null,
                    category: null,
                    gender: null,
                    currentPage: 1,
                    pageSize: 0,
                    filters: null,
                    allowFacet: true,
                    breadCrumb: null,
                    resultCount: 9,
                    includeExcludedBrand: false,
                    facetOnly: false,
                    ignoreDisplayInSerach: false,
                    promoCode: null
                },
                entityType: entityType
            }
        ]*/
    } else if (entityType === Page) { // SiteViewModel
        entity = [
            {
                eventType: eventType,
                entityId: entityObject?.id,
                entityName: entityName,
                entity: {
                    id: entityObject?.id,
                    name: entityObject?.name,
                    metaTitle: entityObject?.metaTitle,
                    MetaKeywords: entityObject?.metaKeywords,
                    MetaDescription: entityObject?.metaDescription,
                    slug: entityObject?.slug,
                    title: entityObject?.title,
                    viewType: entityObject?.viewType,
                },
                entityType: entityType
            }
        ];
    }


    const snippet = {
        content: `<script>var entity = ${JSON.stringify(entity)}</script>`,
        name: "DataLayers_Entity",
        placement: SnippetPlacementType.HEAD_BEFORE_CLOSE,
        type: SnippetContentType.JAVASCRIPT
    };

    useEffect(() => {
        if (entity && entity.length) {
            injectSnippets([snippet]);
        }
    }, []);

    return (
        <></>
    );
}

export default memo(DataLayerSnippet);