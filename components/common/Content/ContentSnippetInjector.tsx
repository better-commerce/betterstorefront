// Base Imports
import React, { memo, useCallback } from "react";

// Package Imports
import Head from "next/head"
import Script from "next/script"
import uniqBy from "lodash/uniqBy";

// Other Imports
import useSnippet, { ISnippetSet } from "@framework/content/use-snippet";

const ContentSnippetInjector: React.FC<React.PropsWithChildren<any>> = (props: any) => {
    let { snippets } = props;
    snippets = uniqBy(snippets, 'name') // Prevent duplicate data being passed on to snippets rendering engine.
    const { topHeadSnippets, headSnippets, restSnippets, }: any = useSnippet(snippets)

    const renderSnippetSet = useCallback((snippetSet: any, strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' | 'worker') => {

        return (
            <>
                {snippetSet?.links?.length > 0 && snippetSet?.links?.map((link: any, index: number) => (
                    <link data-bc-name={`${link?.name}${index + 1}`} key={`${link?.name}${index}`} rel={link?.rel} href={link?.href} />
                ))}
                {snippetSet?.scripts?.length > 0 && snippetSet?.scripts?.map((script: any, index: number) => (
                    <>
                        {script?.innerHTML && (
                            <Script id={`${script?.name}${index + 1}`} data-bc-name={`${script?.name}${index + 1}`} key={`${script?.name}${index}`} dangerouslySetInnerHTML={{ __html: script?.innerHTML }} />
                        )}

                        {script?.src && (
                            <Script id={`${script?.name}${index + 1}`} data-bc-name={`${script?.name}${index + 1}`} key={`${script?.name}${index}`} type={script?.type} src={script?.src} strategy={strategy} />
                        )}
                    </>
                ))}
            </>
        )
    }, [])

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