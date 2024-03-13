// Base Imports
import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
// Package Imports
import Router from 'next/router'

// Component Imports
import AlertRibbon from '@components/ui/AlertRibbon'

// Other Imports
import { useUI } from '@components/ui'
import { CURRENT_THEME } from '@components/utils/constants'
import { ISnippet } from '@framework/content/use-content-snippet'
import { IScriptSnippet } from '../Content/ScriptContentSnippet'

const CheckoutLayoutV2: FC<any> = ({ children }) => {
  const { displayAlert } = useUI()
  const [isLoading, setIsLoading] = useState(false)
  const [topHeadJSSnippets, setTopHeadJSSnippets] = useState(new Array<any>())
  const [headJSSnippets, setHeadJSSnippets] = useState(new Array<any>())

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

  const topHeadElements = (
    topHeadJSSnippets?.map((snippet: ISnippet, index: number) => {
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

  const headElements = (
    headJSSnippets?.map((snippet: ISnippet, index: number) => {
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


  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    if (!document.title) {
      document.title = document.location.host
    }

    return () => {
      Router.events.off('routeChangeStart', () => { })
      Router.events.off('routeChangeComplete', () => { })
    }
  }, [])

  return (
    <>
      <Head>
        {topHeadElements}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-60x60.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`}
        />
        <link rel="icon" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
        {headElements}
      </Head>
      <main className="fit gradient">
        {displayAlert && <AlertRibbon />}
        {children}
      </main>
    </>
  )
}

export default CheckoutLayoutV2
