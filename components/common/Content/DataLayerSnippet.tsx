// Base Imports
import React, { memo, useEffect } from "react";

// Other Imports
import { injectSnippets, SnippetContentType, SnippetPlacementType } from "@components/common/Content/ContentSnippet";

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