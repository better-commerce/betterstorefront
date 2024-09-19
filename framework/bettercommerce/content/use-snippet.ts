// Base Imports
import { useCallback } from "react"

// Other Imports
import { ISnippet, SnippetContentType } from "./use-content-snippet"
import { ILinkSnippet, IScriptSnippet } from "@components/common/Content"

export interface ISnippetSet {
    scripts: Array<any>
    links: Array<any>
    styles: Array<any>
    metas: Array<any>
}

const useSnippet = (snippets: Array<any>) => {
    const getScriptSnippets = useCallback((snippet: ISnippet): Array<IScriptSnippet> => {
        let scripts = new Array<IScriptSnippet>()
        if (typeof window !== "undefined" && typeof window?.document !== "undefined") {
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
    }, [])

    const getLinkSnippets = useCallback((snippet: ISnippet): Array<ILinkSnippet> => {
        let links = new Array<ILinkSnippet>()
        if (typeof window !== "undefined" && typeof window?.document !== "undefined") {
            let container = document.createElement('div')
            container.insertAdjacentHTML('beforeend', snippet.content)
            const arrNodes = container.querySelectorAll('link')
            arrNodes.forEach((node: any, key: number) => {
                /*if (node.innerHTML) {
                    links.push({ name: snippet.name, type: 'text/javascript', innerHTML: node.innerHTML, })
                } else*/ if (node.rel) {
                    links.push({ name: snippet.name, rel: node.rel, href: node.href, })
                }
            })
        }
        return links
    }, [])

    const initSnippet = useCallback(() => {
        const snippet: ISnippetSet = { scripts: new Array<any>(), links: new Array<any>(), styles: new Array<any>(), metas: new Array<any>(), }
        return snippet
    }, [])

    const getTopHeadSnippets = useCallback(() => {

        // --- Top Head Snippets START ---
        let snippetSet = initSnippet()
        let scripts = new Array<any>()
        snippets?.filter((x: ISnippet) => x?.placement === 'TopHead' && x?.type === SnippetContentType.JAVASCRIPT)?.forEach((snippet: ISnippet) => {
            const filteredScripts = getScriptSnippets(snippet)?.map((x: IScriptSnippet) => ({ ...x, name: snippet?.name })) || []
            scripts = scripts.concat(filteredScripts)
        })
        snippetSet.scripts = scripts

        let links = new Array<any>()
        snippets?.filter((x: ISnippet) => x?.placement === 'TopHead`' && x?.type === SnippetContentType.HTML)?.forEach((snippet: ISnippet) => {
            const filteredLinks = getLinkSnippets(snippet)?.map((x: ILinkSnippet) => ({ ...x, name: snippet?.name })) || []
            links = links.concat(filteredLinks)
        })
        snippetSet.links = links
        // --- Top Head Snippets END ---

        return snippetSet
    }, [])

    const getHeadSnippets = useCallback(() => {

        // --- Head Snippets START ---
        let snippetSet = initSnippet()
        let scripts = new Array<any>()
        snippets?.filter((x: ISnippet) => x?.placement === 'Head' && x?.type === SnippetContentType.JAVASCRIPT)?.forEach((snippet: ISnippet) => {
            const filteredScripts = getScriptSnippets(snippet)?.map((x: IScriptSnippet) => ({ ...x, name: snippet?.name })) || []
            scripts = scripts.concat(filteredScripts)
        })
        snippetSet.scripts = scripts

        let links = new Array<any>()
        snippets?.filter((x: ISnippet) => x?.placement === 'Head' && x?.type === SnippetContentType.HTML)?.forEach((snippet: ISnippet) => {
            const filteredLinks = getLinkSnippets(snippet)?.map((x: ILinkSnippet) => ({ ...x, name: snippet?.name })) || []
            links = links.concat(filteredLinks)
        })
        snippetSet.links = links
        // --- Head Snippets END ---

        return snippetSet
    }, [])

    const getRestSnippets = useCallback(() => {

        // --- REST of the Snippets START ---
        let snippetSet = initSnippet()
        let scripts = new Array<any>()
        snippets?.filter((x: ISnippet) => !(['Head', 'TopHead'].includes(x?.placement)) && x?.type === SnippetContentType.JAVASCRIPT)?.forEach((snippet: ISnippet) => {
            const filteredScripts = getScriptSnippets(snippet)?.map((x: IScriptSnippet) => ({ ...x, name: snippet?.name })) || []
            scripts = scripts.concat(filteredScripts)
        })
        snippetSet.scripts = scripts

        let links = new Array<any>()
        snippets?.filter((x: ISnippet) => !(['Head', 'TopHead'].includes(x?.placement)) && x?.type === SnippetContentType.HTML)?.forEach((snippet: ISnippet) => {
            const filteredLinks = getLinkSnippets(snippet)?.map((x: ILinkSnippet) => ({ ...x, name: snippet?.name })) || []
            links = links.concat(filteredLinks)
        })
        snippetSet.links = links
        // --- REST of the Snippets END ---

        return snippetSet
    }, [])

    const topHeadSnippets = getTopHeadSnippets()
    const headSnippets = getHeadSnippets()
    const restSnippets = getRestSnippets()

    return { topHeadSnippets, headSnippets, restSnippets, }
}

export default useSnippet