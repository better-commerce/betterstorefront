// Base Imports
import React from 'react'

// Package Imports
import { Hits, useInstantSearch } from 'react-instantsearch'

// Component Imports
import Hit from '../Hit'

// Other Imports


const SearchContent = ({ maxBasketItemsCount, handleClearSearch }: any) => {
    const { results } = useInstantSearch()
    if (!results.__isArtificial && results.nbHits === 0) {
        return (
            <div className="m-2 ml-4">
                No results found for <strong>{results.query}</strong>.
            </div>
        )
    }

    return (
        <Hits hitComponent={({ hit }: any) => <Hit hit={hit} maxBasketItemsCount={maxBasketItemsCount} handleClearSearch={handleClearSearch} />} />
    )
}

export default SearchContent