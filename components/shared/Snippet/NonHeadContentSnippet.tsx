// Base Imports
import React, { memo, useEffect, useState } from 'react'

// Other Imports
import { ELEM_ATTR, ISnippet } from '@framework/content/use-content-snippet'
import ContentSnippet from './ContentSnippet'

const NonHeadContentSnippet = memo((props: any) => {
    const { snippets, refs } = props
    const { bodyStartScrCntrRef, bodyEndScrCntrRef } = refs
    const [loaded, isLoaded] = useState(true)
    const restSnippets = snippets?.filter((x: ISnippet) => !['topHead', 'head'].includes(x?.placement?.toLowerCase()))
    useEffect(() => {
        const bodyStartElem: any = document.querySelector(`div.${ELEM_ATTR}body-start-script-cntr`)
        const bodyEndElem: any = document.querySelector(`div.${ELEM_ATTR}body-end-script-cntr`)

        if (bodyStartElem) {
            const childNodes: Array<any> = bodyStartElem.childNodes
            if (childNodes?.length) {
                childNodes?.forEach((childNode: any) => {
                    bodyStartElem?.removeChild(childNode)
                })
            }
        }

        if (bodyEndElem) {
            const childNodes: Array<any> = bodyEndElem.childNodes
            if (childNodes?.length) {
                childNodes?.forEach((childNode: any) => {
                    bodyEndElem?.removeChild(childNode)
                })
            }
        }

        //setTimeout(() => {
        isLoaded((restSnippets?.length > 0 /*&& (bodyStartElem?.childNodes?.length > 0 && bodyEndElem?.childNodes?.length > 0)*/))
        //}, 1);

        /*//setTimeout(() => {
        isLoaded(false)
        //}, 1);

        return () => {
            isLoaded(false)
        }*/
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