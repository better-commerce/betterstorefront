// Base Imports
import React, { memo, useCallback, useEffect } from "react";

// Package Imports
import Head from "next/head"
import Script from "next/script"
import uniqBy from "lodash/uniqBy";

// Other Imports
import useSnippet, { ISnippetSet } from "@framework/content/use-snippet";
import { ELEM_ATTR, HEAD_ELEM_SELECTORS, removeInjections } from "@framework/content/use-content-snippet";

const ContentSnippetInjector: React.FC<React.PropsWithChildren<any>> = (props: any) => {
    const containerRef = React.createRef<any>()
    let { snippets } = props;
    snippets = uniqBy(snippets, 'name') // Prevent duplicate data being passed on to snippets rendering engine.
    const { topHeadSnippets, headSnippets, restSnippets, }: any = useSnippet(snippets)

    
    /**
     * Injects snippets into container.
     * @param snippets - Array of snippets to inject.
     */
    const injectSnippetsBody = useCallback((snippets: any, container: any, snippetAttrName?: string) => {
        snippets?.filter((x: any)=> x.innerHTML)?.forEach((snippet: any, index: number) => {
            const script = document.createElement('script')
            script.innerHTML = snippet?.innerHTML
            script.async = true
            if (snippetAttrName) {
                script.setAttribute(snippetAttrName, snippet?.name)
            }
            container.appendChild(script)
        })
    }, [])

    const renderSnippetSet = useCallback((snippetSet: any, strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' | 'worker') => {

        return (
            <>
                {snippetSet?.links?.length > 0 && snippetSet?.links?.map((link: any, index: number) => (
                    <link data-bc-name={`${link?.name}${index + 1}`} key={`${link?.name}${index}`} rel={link?.rel} href={link?.href} />
                ))}
                {snippetSet?.scripts?.length > 0 && snippetSet?.scripts?.map((script: any, index: number) => (
                    <>
                        {/*{script?.innerHTML && (
                            <script dangerouslySetInnerHTML={{ __html: script?.innerHTML }}></script>
                        )}*/}

                        {script?.src && (
                            <Script id={`${script?.name}${index + 1}`} data-bc-name={`${script?.name}${index + 1}`} key={`${script?.name}${index}`} type={script?.type} src={script?.src} strategy={strategy} />
                        )}
                    </>
                ))}
            </>
        )
    }, [])

    useEffect(() => {
        removeInjections([`${ELEM_ATTR}${HEAD_ELEM_SELECTORS[0]}`], document.head)
        injectSnippetsBody(topHeadSnippets?.scripts || [], document.head, `${ELEM_ATTR}${HEAD_ELEM_SELECTORS[0]}`)
    }, [topHeadSnippets])

    useEffect(() => {
        removeInjections([`${ELEM_ATTR}${HEAD_ELEM_SELECTORS[1]}`], document.head)
        injectSnippetsBody(headSnippets?.scripts || [], document.head, `${ELEM_ATTR}${HEAD_ELEM_SELECTORS[1]}`)
    }, [headSnippets])

    useEffect(() => {
        injectSnippetsBody(restSnippets?.scripts || [], document.body)
    }, [restSnippets])

    return (
        <>
            {/* --- Head & TopHead content snippet injection START --- */}
            <Head>
                {renderSnippetSet(topHeadSnippets, "beforeInteractive")}

                {/* Add {children} here, if required */}

                {renderSnippetSet(headSnippets, "beforeInteractive")}
            </Head>
            {/* --- Head & TopHead content snippet injection END --- */}

            {/* --- REST of the content snippet injection START --- */}
            {renderSnippetSet(restSnippets, "afterInteractive")}
            {/* --- REST of the content snippet injection END --- */}
        </>
    );
};

export default memo(ContentSnippetInjector);