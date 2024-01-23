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

const CheckoutLayoutV2: FC<any> = ({ children }) => {
  const { displayAlert } = useUI()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    if (!document.title) {
      document.title = document.location.host
    }

    return () => {
      Router.events.off('routeChangeStart', () => {})
      Router.events.off('routeChangeComplete', () => {})
    }
  }, [])

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-60x60.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`}
        />
        <link rel="icon" href={`/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
      </Head>
      <main className="fit gradient">
        {displayAlert && <AlertRibbon />}
        {children}
      </main>
    </>
  )
}

export default CheckoutLayoutV2
