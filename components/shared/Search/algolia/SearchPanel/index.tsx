// Base Imports
import { useTranslation } from '@commerce/utils/use-translation'
import React from 'react'

// Package Imports
import { useInstantSearch } from 'react-instantsearch'

type PanelProps = React.PropsWithChildren<{
    header: string
}>

const SearchPanel = ({ header, children }: PanelProps) => {
    const translate = useTranslation();
    const { results } = useInstantSearch()

    return (
        <div className="ais-Panel">
            <div className="ais-Panel-header dark:text-black">
                <span>{header}</span>
            </div>
            {
                (!results.__isArtificial && results.nbHits === 0) ? (
                    <div className="ml-4 m-2">
                        {translate('label.search.noResultFoundForText')} <strong>{results.query}</strong>.
                    </div>
                ) : (
                    <div className="ais-Panel-body">{children}</div>
                )
            }

        </div>
    )
}

export default SearchPanel