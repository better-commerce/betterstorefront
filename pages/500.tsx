// Base Imports
import React from 'react'

// Package Imports
import Link from 'next/link'
import NextHead from 'next/head'
import type { GetStaticPropsContext } from 'next'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutError from '@components/Layout/LayoutError'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: { [Cookie.Key.LANGUAGE]: locale } })

  return {
    props: {
      ...pageProps,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
  }
}

function InternalServerError({ deviceInfo }: any) {
  const translate = useTranslation()
  const { isMobile, isIPadorTablet } = deviceInfo

  useAnalytics(EVENTS_MAP.EVENT_TYPES.PageViewed, {
    entityName: PAGE_TYPES.InternalError,
    entityType: EVENTS_MAP.ENTITY_TYPES.Page,
    eventType: EVENTS_MAP.EVENT_TYPES.PageViewed,
  })

  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" id="canonical" href={absPath} />
        <title>{translate('label.500.titleText')}</title>
        <meta name="title" content={translate('label.500.titleText')} />
        <meta name="description" content={translate('label.500.titleText')} />
        <meta name="keywords" content={translate('label.500.titleText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.500.titleText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.500.titleText')} key="ogdesc" />
      </NextHead>

      {(isMobile || isIPadorTablet) ? (
        <>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-red-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-red-800 font-h1-xl'>500</h1>
                <h2 className="mb-2 font-semibold text-red-600 font-32">
                  {translate('label.500.internalServerErrorText')}
                </h2>
                <p className="font-16 text-brown-light">
                  {translate('common.label.pageErrorDesc')}
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  {translate('common.label.backToHomepageText')}
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-red-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-red-800 font-h1-xl'>500</h1>
                <h2 className="mb-2 font-semibold text-red-600 font-32">
                  {translate('common.label.internalServerError')}
                </h2>
                <p className="font-16 text-brown-light">
                  {translate('common.label.pageErrorDesc')}
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  {translate('common.label.backToHomepageText')}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

InternalServerError.Layout = LayoutError
export default withDataLayer(InternalServerError, PAGE_TYPES.InternalError)