// Base Imports
import React from 'react'

// Package Imports
import { useInstantSearch } from 'react-instantsearch'
import { Pagination } from 'react-instantsearch'

// Other Imports

const PagerContainer = (props: any) => {

    const { results } = useInstantSearch()

    if (!results.__isArtificial && results.nbHits === 0) {
        return <></>
    }

    return (
        <Pagination />
    )

}

export default PagerContainer