export interface IScriptSnippet {
    readonly name?: string
    readonly src?: string
    readonly type?: string
    readonly innerHTML?: string
}

export interface ILinkSnippet {
    readonly name?: string
    readonly rel?: string
    readonly href?: string
}

export { default as ContentSnippetInjector } from "./ContentSnippetInjector";