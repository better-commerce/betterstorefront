import React from 'react'
import Head from 'next/head'

import { PreviewBanner } from '@components/contentful/preview-banner'
import { TopNavigation } from '@components/contentful/top-navigation'
import App from 'next/app'
import {
  getLocale,
  LocaleContext,
  UnknownLocale,
} from '@lib/contentful/translations'

function HelpdeskApp({ pageProps }: any) {
  const locale: any = 'en-US'

  return (
    <LocaleContext.Provider value={locale}>
      <div className="flex flex-col bg-white">
        <Head>
          <link
            rel="shortcut icon"
            href="/favicon/favicon.png"
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            href="/favicon/apple-icon-57x57.png"
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            href="/favicon/apple-icon-72x72.png"
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            href="/favicon/apple-icon-114x114.png"
            type="image/png"
          />
          <meta
            name="description"
            content={`Demo Help Center built using Next.js and Contentful Compose.`}
            key="description"
          />
        </Head>
        <PreviewBanner />
        <div className="w-full flex flex-col relative">
          <TopNavigation />
        </div>
      </div>
    </LocaleContext.Provider>
  )
}

export default HelpdeskApp
