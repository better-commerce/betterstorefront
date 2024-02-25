// Base Imports
import React, { memo, useEffect, useState } from 'react'

// Component Imports
import ContentSnippet from './ContentSnippet'

// Other Imports
import { ISnippet } from '@framework/content/use-content-snippet'

const NonHeadContentSnippet = memo((props: any) => {
    const { snippets, refs } = props
    const { bodyStartScrCntrRef, bodyEndScrCntrRef } = refs
    const [loaded, isLoaded] = useState(true)
    const restSnippets = snippets?.filter((x: ISnippet) => !['topHead', 'head'].includes(x?.placement?.toLowerCase()))
    useEffect(() => {
        const bodyStartElem: any = document.querySelector('div.data-bc-snippet-body-start-script-cntr')
        const bodyEndElem: any = document.querySelector('div.data-bc-snippet-body-end-script-cntr')

        //setTimeout(() => {
        isLoaded((restSnippets?.length > 0 && (bodyStartElem?.childNodes?.length > 0 && bodyEndElem?.childNodes?.length > 0)))
        //}, 1);
    }, [])

    if (loaded) {
        return (
            <ContentSnippet
                {...{ snippets: restSnippets, refs: { bodyStartScrCntrRef, bodyEndScrCntrRef } }}
            />
        )
    }
    return null
})

export default NonHeadContentSnippet