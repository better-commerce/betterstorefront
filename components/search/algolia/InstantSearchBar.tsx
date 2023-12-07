// Base Imports
import React, { useRef, useState } from 'react'

// Package Imports
import algoliaSearch from 'algoliasearch/lite'
import { Configure, InstantSearch, RangeInput, RefinementList, SearchBox, Stats, } from 'react-instantsearch'

// Component Imports
import SearchContent from './SearchContent'
import SearchPanel from './SearchPanel'
import PagerContainer from './PagerContainer'
import QuerySuggestions from './QuerySuggestions'

// Other Imports
import { useUI } from '@components/ui'
import { getAlgoliaSearchPriceColumn, resetAlgoliaSearch, vatIncluded } from '@framework/utils/app-util'
import { EmptyString } from '@components/utils/constants';
import { isMobile } from 'react-device-detect'

const INDEX_NAME = process.env.ALGOLIA_SEARCH_INDEX
const ORIGINAL_SEARCH_CLIENT = algoliaSearch(process.env.ALGOLIA_SEARCH_APPLICATION_ID!, process.env.ALGOLIA_SEARCH_API_KEY!)
const SEARCH_CLIENT = {
    ...ORIGINAL_SEARCH_CLIENT,
    search(requests: any) {
        if (requests.every(({ params }: any) => !params.query)) {
            return Promise.resolve({
                results: requests.map(() => ({
                    hits: [],
                    nbHits: 0,
                    nbPages: 0,
                    page: 0,
                    processingTimeMS: 0
                }))
            });
        }
        return ORIGINAL_SEARCH_CLIENT.search(requests);
    }
}
const ALGOLIA_SEARCH_SUGGESTIONS_INDEX = process.env.ALGOLIA_SEARCH_SUGGESTIONS_INDEX! || 'productindex_dev_query_suggestions'
const ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID = process.env.ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID! || 'productindex_dev'

const InstantSearchBar = (props: any) => {
    const { maxBasketItemsCount } = props
    const isIncludeVAT = vatIncluded()
    const priceStatAttrKey = getAlgoliaSearchPriceColumn(isIncludeVAT)
    const { showSearchBar, setShowSearchBar } = useUI()
    const [searchTerm, setSearchTerm] = useState(EmptyString)

    const handleChange = (ev: any) => {
        setSearchTerm(ev?.target?.value)
        const searchTermLen = ev?.target?.value?.length || 0
        setShowSearchBar(searchTermLen >= 2)
    }

    const handleClearSearch = () => {
        resetAlgoliaSearch()
        setSearchTerm(EmptyString)
        setShowSearchBar(false)
    }
    const [isActive, setActive] = useState(false);

    const openPanel = () => {
        setActive(!isActive);
    }

    return (
        <InstantSearch
            searchClient={SEARCH_CLIENT}
            indexName={INDEX_NAME}
            insights={true}
        >
            <div id="searchbox" className="relative justify-start w-full min-w-0 pr-0 text-left text-gray-400 sm:pr-3 sm:p-1 hover:text-gray-500" aria-label="Search">
                <span className='absolute search-icon-pos'><i className='sprite-icons sprite-search'></i></span>
                <SearchBox
                    placeholder="Search"
                    onChangeCapture={handleChange}
                    onResetCapture={handleClearSearch}
                />
            </div>

            {
                showSearchBar && (
                    <div className="absolute z-10 w-screen h-auto border-b border-gray-300 shadow min-h-screen bg-white top-[63px] sm:top-[74px] search-wrapper instant-search-wrapper">
                        <main className="search-container">
                            <Configure
                                hitsPerPage={12}
                                attributesToSnippet={['description:24']}
                                snippetEllipsisText="[…]"
                            />
                            <div className="right-panel">
                                <div id="hits">
                                    <SearchContent maxBasketItemsCount={maxBasketItemsCount} handleClearSearch={handleClearSearch} />
                                </div>
                                {/*<div id="searchbox">
                                    <SearchBox placeholder="Search for products" />
                                </div>*/}
                                <div id="stats">
                                    <Stats />
                                    <div className='block sm:hidden'>
                                        <button type="button"
                                            onClick={openPanel}
                                            className='w-full my-2 btn-primary-blue'>Show Filters</button>
                                    </div>
                                </div>

                                {
                                    (isMobile) && (
                                        <div id="suggestions" className="mb-5">
                                            <SearchPanel header="Search Suggestions">
                                                <QuerySuggestions searchClient={SEARCH_CLIENT} indexName={ALGOLIA_SEARCH_SUGGESTIONS_INDEX} indexSourceId={ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID} searchTerm={searchTerm} setSearchTerm={setSearchTerm} hitsPerPage={5} />
                                                {/*<SearchSuggestions autoCompleteRef={autoCompleteRef} searchTerm={searchTerm} />*/}
                                            </SearchPanel>
                                        </div>
                                    )
                                }

                                <div id="pagination">
                                    <PagerContainer />
                                </div>
                            </div>
                            <div
                                className={`left-panel mob-section-hide ${isActive ? 'side-filter-panel z-99' : ""}`} >
                                <div className='block w-full px-8 py-2 text-right sm:hidden'>
                                    <button type="button"
                                        onClick={openPanel}
                                        className='inline-block'><i className='sprite-icons sprite-cross-small'></i></button>
                                </div>

                                {
                                    !(isMobile) && (
                                        <div id="suggestions">
                                            <SearchPanel header="Search Suggestions">
                                                <QuerySuggestions searchClient={SEARCH_CLIENT} indexName={ALGOLIA_SEARCH_SUGGESTIONS_INDEX} indexSourceId={ALGOLIA_SEARCH_SUGGESTIONS_INDEX_SOURCE_ID} searchTerm={searchTerm} setSearchTerm={setSearchTerm} hitsPerPage={5} />
                                                {/*<SearchSuggestions autoCompleteRef={autoCompleteRef} searchTerm={searchTerm} />*/}
                                            </SearchPanel>
                                        </div>
                                    )
                                }

                                <div id="categories">
                                    <SearchPanel header="Categories">
                                        <RefinementList
                                            attribute="categories"
                                            translations={{ noResultsText: 'No results' }}
                                        />
                                    </SearchPanel>
                                </div>
                                <div id="brands">
                                    <SearchPanel header="Brands">
                                        <RefinementList
                                            attribute="brand"
                                            searchable={true}
                                            searchablePlaceholder="Search for other..."
                                            translations={{ noResultsText: 'No results' }}
                                        />
                                    </SearchPanel>
                                </div>
                                <div id="price">
                                    <SearchPanel header="Price">
                                        <RangeInput attribute={priceStatAttrKey} {...props} />
                                    </SearchPanel>
                                </div>
                            </div>
                        </main>
                    </div>
                )
            }

        </InstantSearch>
    )
}

export default InstantSearchBar