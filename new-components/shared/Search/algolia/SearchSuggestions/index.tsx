// Base Imports
import React, { useMemo, useState } from 'react'

// Package Imports
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

// Other Imports
import { EmptyObject } from '@new-components/utils/constants';

const ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID = process.env.ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID!


const SearchSuggestions = ({ searchClient, indexName, sourceId, autoCompleteRef }: any) => {

    const [autoCompleteState, setAutoCompleteState] = useState<any>({})

    {/*<input
        className="ais-SearchBox-input"
        placeholder="Search for products"
        onChangeCapture={handleChange}
        onResetCapture={handleClearSearch}
        {...autocomplete.getInputProps(EmptyObject)} />*/}

    const autocomplete = useMemo<any>(
        () =>
            createAutocomplete({
                openOnFocus: true,
                onStateChange({ state }) {
                    // (2) Synchronize the Autocomplete state with the React state.
                    setAutoCompleteState(state);
                },
                getSources(params: any): any {
                    return [
                        // (3) Use an Algolia index source.
                        {
                            sourceId,
                            getItemInputValue({ item }: any) {
                                return item.query;
                            },
                            getItems({ query }: any) {
                                const results = getAlgoliaResults({
                                    searchClient,
                                    queries: [
                                        {
                                            indexName,
                                            query,
                                            params: {
                                                hitsPerPage: 5,
                                                highlightPreTag: '<mark>',
                                                highlightPostTag: '</mark>',
                                            },
                                        },
                                    ],
                                })
                                return results;
                            },
                            getItemUrl({ item }: any) {
                                return item.url;
                            },
                        },
                    ];
                },
            }),
        []
    )

    return (
        <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
            <>
                <input ref={autoCompleteRef} className="ais-aa-Input" {...autocomplete.getInputProps(EmptyObject)} />

                <div className="ais-Panel-body" {...autocomplete.getPanelProps(EmptyObject)}>
                    {autoCompleteState.isOpen &&
                        autoCompleteState.collections.map((collection: any, index: number) => {
                            const { source, items } = collection;

                            return (
                                <div key={`source-${index}`} className="ais-RefinementList">
                                    {items.length > 0 && (
                                        <ul className="ais-RefinementList-list" {...autocomplete.getListProps()}>
                                            {items.map((item: any) => (
                                                <li
                                                    key={item.objectID}
                                                    className="ais-RefinementList-item"
                                                    {...autocomplete.getItemProps({
                                                        item,
                                                        source,
                                                    })}
                                                >
                                                    <label className="ais-RefinementList-label">
                                                        <span
                                                            className="ais-RefinementList-labelText"
                                                            dangerouslySetInnerHTML={{ __html: item?._highlightResult?.query?.value }}>
                                                        </span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </>
        </div>
    )
}

export default SearchSuggestions