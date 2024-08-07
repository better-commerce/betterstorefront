// Base Imports
import React, { memo, } from 'react'

// Component Imports

// Other Imports
import { ISnippet } from '@framework/content/use-content-snippet'

export interface IScriptSnippet {
    readonly name?: string
    readonly src?: string
    readonly type?: string
    readonly innerHTML?: string
}

const ScriptContentSnippet = memo(({ snippets }: any) => {

    const getScriptSnippets = (snippet: ISnippet): Array<IScriptSnippet> => {
        let scripts = new Array<IScriptSnippet>()
        if (typeof document !== undefined) {
            let container = document.createElement('div')
            container.insertAdjacentHTML('beforeend', snippet.content)
            const arrNodes = container.querySelectorAll('*')
            arrNodes.forEach((node: any, key: number) => {
                if (node.innerHTML) {
                    scripts.push({ name: snippet.name, type: 'text/javascript', innerHTML: node.innerHTML, })
                } else if (node.src) {
                    scripts.push({ name: snippet.name, type: 'text/javascript', src: node.src, })
                }
            })
        }
        return scripts
    }

    return (
        snippets?.map((snippet: ISnippet, index: number) => {
            const scripts = getScriptSnippets(snippet)
            return (
                scripts.length > 0 &&
                scripts?.map((script: IScriptSnippet, index: number) => (
                    <>
                        {script?.src && (
                            <script data-bc-name={snippet.name} type={script?.type || 'text/javascript'} src={script?.src}></script>
                        )}
                        {script?.innerHTML && (
                            <script data-bc-name={snippet.name} type={script?.type || 'text/javascript'} dangerouslySetInnerHTML={{ __html: script?.innerHTML }}></script>
                        )}
                    </>
                ))
            )
        })
    )
})

export default ScriptContentSnippet