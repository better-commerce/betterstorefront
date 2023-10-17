// Base Imports
import React, { useEffect, useState } from "react";

// Other Imports
import { setNativeValue, triggerKeyPress } from "@framework/utils/ui-util";

const QuerySuggestions = ({ searchClient, indexName, indexSourceId, searchTerm, setSearchTerm, hitsPerPage }: any) => {
    const SEARCH_INPUT_SELECTOR = 'input.ais-SearchBox-input'
    const SEARCH_INPUT_SUBMIT_SELECTOR = 'button.ais-SearchBox-submit'
    const [items, setItems] = useState<Array<any>>([])

    const onQuerySuggestionClicked = (query: string) => {
        const input: any = document.querySelector(SEARCH_INPUT_SELECTOR)
        //const submitBtn: any = document.querySelector(SEARCH_INPUT_SUBMIT_SELECTOR)
        if (input) {
            setNativeValue(input, query);
            triggerKeyPress(input)
            input.focus()

            //input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }))
            /*if (submitBtn?.click) {
                submitBtn?.click()
            } else if (submitBtn?.onclick) {
                submitBtn?.onclick()
            }*/
        }
    }

    useEffect(() => {
        const index = searchClient.initIndex(indexName)
        index.search(searchTerm).then(({ hits }: any) => {
            const results = hits?.sort((hit1: any, hit2: any) => ((hit2?.popularity || 0) - (hit1?.popularity || 0)))
            setItems(results?.splice(0, hitsPerPage));
        }).catch((err: any) => {
            //console.log(err);
        });

    }, [searchTerm])

    return (
        <div className="aa-Autocomplete">
            <div className="ais-Panel-body">
                {(items?.length > 0) ? (
                    <div className="ais-RefinementList">
                        <ul className="ais-RefinementList-list">
                            {items.map((item: any) => (
                                <li key={item.objectID} className="ais-RefinementList-item">
                                    <label className="ais-RefinementList-label">
                                        <a href={item?.url} onClick={(ev: any) => onQuerySuggestionClicked(item?.query)}>
                                            <span
                                                className="ais-RefinementList-labelText"
                                                dangerouslySetInnerHTML={{ __html: item?._highlightResult?.query?.value?.replaceAll("em>", "mark>") }}>
                                            </span>
                                        </a>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="ml-4 m-2">
                        No results found for <strong><mark>{searchTerm}</mark></strong>.
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuerySuggestions