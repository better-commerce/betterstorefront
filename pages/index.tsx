// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'

// Component Imports
import { Layout } from '@components/common'

// Other Imports
import commerce from '@lib/api/commerce'
import { Hero } from '@components/ui'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_DEFAULT_SLUG, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { useRouter } from 'next/router'
import { getCurrency, getCurrentCurrency, obfuscateHostName, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings } from '@framework/utils/parse-util'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
const PromotionBanner = dynamic(() => import('@components/home/PromotionBanner'))
const Heading = dynamic(() => import('@components/home/Heading'))
const Categories = dynamic(() => import('@components/home/Categories'))
const Collections = dynamic(() => import('@components/home/Collections'))
const ProductSlider = dynamic(() => import('@components/home/ProductSlider'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const cachedData = await getDataByUID([ Redis.Key.HomepageWeb, Redis.Key.HomepageMobileWeb, ])
  const pageContentWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageWeb) || []
  const pageContentMobileWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageMobileWeb) || []

  const config = { locale, locales }
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const promises = new Array<Promise<any>>()
  if (!containsArrayData(pageContentWebUIDData)) {
    infra?.currencies
      ?.map((x: any) => x?.currencyCode)
      ?.forEach((currencyCode: string, index: number) => {
        promises.push(
          new Promise<any>(async (resolve: any, reject: any) => {
            try {
              const pageContentsPromiseWeb = commerce.getPagePreviewContent({
                id: '',
                slug: HOME_PAGE_DEFAULT_SLUG,
                workingVersion:
                  process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
                channel: 'Web',
                currency: currencyCode,
                cachedCopy: true,
              })
              const pageContentWeb = await pageContentsPromiseWeb
              pageContentWebUIDData.push({ key: currencyCode, value: pageContentWeb })
              await setData([{ key: Redis.Key.HomepageWeb, value: pageContentWebUIDData }])
              resolve()
            } catch (error: any) {
              resolve()
            }
          })
        )
      })
  }

  if (!containsArrayData(pageContentMobileWebUIDData)) {
    infra?.currencies
      ?.map((x: any) => x?.currencyCode)
      ?.forEach((currencyCode: string, index: number) => {
        promises.push(
          new Promise(async (resolve: any, reject: any) => {
          try {
            const pageContentsPromiseMobileWeb = commerce.getPagePreviewContent(
              {
                id: '',
                slug: HOME_PAGE_DEFAULT_SLUG,
                workingVersion:
                  process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
                channel: 'MobileWeb',
                currency: currencyCode,
                cachedCopy: true,
              }
            )
            const pageContentMobileWeb = await pageContentsPromiseMobileWeb
            pageContentMobileWebUIDData.push({
              key: currencyCode,
              value: pageContentMobileWeb,
            })
            await setData([{ key: Redis.Key.HomepageMobileWeb, value: pageContentMobileWebUIDData }])
            resolve()
          } catch (error: any) {
            resolve()
          }
        })
      )
    })
  }

  await Promise.all(promises)
  const hostName = os.hostname()
  return {
    props: {
      globalSnippets: infra?.snippets ?? [],
      pageContentsWeb: pageContentWebUIDData,
      pageContentsMobileWeb: pageContentMobileWebUIDData,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ setEntities, recordEvent, ipAddress, pageContentsWeb, pageContentsMobileWeb, hostName, deviceInfo, }: any) {
  const router = useRouter()
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const currencyCode = getCurrency()
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)

  useEffect(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: HOME_PAGE_DEFAULT_SLUG,
          workingVersion: process.env.NODE_ENV === 'production' ? true : true,
          channel: isMobile ? 'MobileWeb' : 'Web',
          cachedCopy: true,
          currencyCode,
        })
        .then((res: any) => {
          if (res?.data) setPageContents(res?.data)
        })
      setCurrentCurrency(currencyCode)
    }
  }, [currencyCode, isMobile])

  useAnalytics(PageViewed, {
    entity: JSON.stringify({
      id: '',
      name: pageContents?.metatitle,
      metaTitle: pageContents?.metaTitle,
      MetaKeywords: pageContents?.metaKeywords,
      MetaDescription: pageContents?.metaDescription,
      Slug: pageContents?.slug,
      Title: pageContents?.metatitle,
      ViewType: 'Page View',
    }),
    entityName: PAGE_TYPE,
    pageTitle: pageContents?.metaTitle,
    entityType: 'Page',
    entityId: '',
    eventType: 'PageViewed',
  })
  const css = { maxWidth: '100%', minHeight: '350px' }

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con"> <Loader /> </div>
    )
  }

  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath} />
          <title>{pageContents?.metatitle || 'Home'}</title>
          <meta name="title" content={pageContents?.metatitle || 'Home'} />
          {pageContents?.metadescription && (
            <meta name="description" content={pageContents?.metadescription} />
          )}
          {pageContents?.metakeywords && (
            <meta name="keywords" content={pageContents?.metakeywords} />
          )}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (
            <meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />
          )}
          {pageContents?.metadescription && (
            <meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />
          )}
        </NextHead>
      )}
      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <Hero deviceInfo={deviceInfo} banners={pageContents?.banner} />
      <div className="px-4 py-3 mx-auto lg:container sm:py-6 sm:px-4 md:px-4 lg:px-6 2xl:px-0">
        {pageContents?.heading?.map((heading: any, hId: number) => (
          <Heading title={heading?.heading_title} subTitle={heading?.heading_subtitle} key={`category-heading-${hId}`} />
        ))}
        <Categories data={pageContents?.categorylist} deviceInfo={deviceInfo} />
        {pageContents?.productheading?.map((productH: any, Pid: number) => (
          <Heading title={productH?.productheading_title} subTitle={productH?.productheading_subtitle} key={`product-heading-${Pid}`} />
        ))}
        <ProductSlider config={pageContents} deviceInfo={deviceInfo} />
      </div>

      {pageContents?.promotions?.map((banner: any, bId: number) => (
        <PromotionBanner data={banner} key={bId} css={css} />
      ))}
      <div className="px-4 py-3 mx-auto lg:container sm:px-4 lg:px-0 sm:py-6 md:px-4">
        {pageContents?.collectionheadings?.map((heading: any, cId: number) => (
          <Heading title={heading?.collectionheadings_title} subTitle={heading?.collectionheadings_subtitle} key={`collection-heading-${cId}`} />
        ))}
        <Collections data={pageContents?.collectionlist} />
      </div>
    </>
  )
}

Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)
