// Base Imports
import React from 'react'

// Package Imports
import { Hits, useInstantSearch } from 'react-instantsearch'

// Component Imports
import Hit from '../Hit'
import { useTranslation } from '@commerce/utils/use-translation'

// Other Imports


const SearchContent = ({ maxBasketItemsCount, handleClearSearch }: any) => {
    const translate = useTranslation()
    const { results } = useInstantSearch()
    if (!results.__isArtificial && results.nbHits === 0) {
        return (
            <div className="m-2 ml-4">
                {translate('label.search.noResultFoundForText')} <strong>{results.query}</strong>.
            </div>
        )
    }

    return (
        <Hits hitComponent={({ hit }: any) => <Hit hit={hit} maxBasketItemsCount={maxBasketItemsCount} handleClearSearch={handleClearSearch} />} />
    )
}

export default SearchContent