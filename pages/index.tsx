// Base Imports
import React, { useEffect, useState } from 'react'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Link from 'next/link'
import axios from 'axios'
// Other Imports
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import {
  HOMEPAGE_SLUG,
  NEXT_REFERRAL_ADD_USER_REFEREE,
  NEXT_REFERRAL_BY_SLUG,
  NEXT_REFERRAL_CLICK_ON_INVITE,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_DEFAULT_SLUG } from '@framework/utils/constants'
import { useRouter } from 'next/router'
import os from 'os'
import { getCurrency, obfuscateHostName } from '@framework/utils/app-util'
import { FeatureBar } from '@components/common'
import { Button } from '@components/ui'

const PromotionBanner = dynamic(
  () => import('@components/home/PromotionBanner')
)
const Heading = dynamic(() => import('@components/home/Heading'))
const Categories = dynamic(() => import('@components/home/Categories'))
const Collections = dynamic(() => import('@components/home/Collections'))
const ProductSlider = dynamic(() => import('@components/home/ProductSlider'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
const RefferalCard = dynamic(
  () => import('@components/customer/Referral/ReferralCard')
)

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise
  let pageContentsWeb = new Array<any>()
  let pageContentsMobileWeb = new Array<any>()
  const promises = new Array<Promise<any>>()

  infra?.currencies
    ?.map((x: any) => x?.currencyCode)
    ?.forEach((currencyCode: string, index: number) => {
      promises.push(
        new Promise<any>(async (resolve: any, reject: any) => {
          try {
            const PageContentsPromiseWeb = commerce.getPagePreviewContent({
              id: '',
              slug: HOME_PAGE_DEFAULT_SLUG,
              workingVersion:
                process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
              channel: 'Web',
              currency: currencyCode,
              cachedCopy: true,
            })
            const PageContentWeb = await PageContentsPromiseWeb
            pageContentsWeb.push({ key: currencyCode, value: PageContentWeb })
            resolve()
          } catch (error: any) {
            resolve()
          }
        })
      )
    })

  infra?.currencies
    ?.map((x: any) => x?.currencyCode)
    ?.forEach((currencyCode: string, index: number) => {
      promises.push(
        new Promise(async (resolve: any, reject: any) => {
          try {
            const PageContentsPromiseMobileWeb = commerce.getPagePreviewContent(
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
            const PageContentMobileWeb = await PageContentsPromiseMobileWeb
            pageContentsMobileWeb.push({
              key: currencyCode,
              value: PageContentMobileWeb,
            })
            resolve()
          } catch (error: any) {
            resolve()
          }
        })
      )
    })

  await Promise.all(promises)

  const hostName = os.hostname()

  return {
    props: {
      categories,
      brands,
      pages,
      globalSnippets: infra?.snippets ?? [],
      pageContentsWeb: pageContentsWeb ?? [],
      pageContentsMobileWeb: pageContentsMobileWeb ?? [],
      hostName: obfuscateHostName(hostName),
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({
  setEntities,
  recordEvent,
  ipAddress,
  pageContentsWeb,
  pageContentsMobileWeb,
  hostName,
  deviceInfo,
}: any) {
  const router = useRouter()
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const currencyCode = getCurrency()
  const homePageContents = isMobile
    ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value ||
      []
    : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)

  useEffect(() => {
    axios
      .post('/api/page-preview-content', {
        id: '',
        slug: HOME_PAGE_DEFAULT_SLUG,
        workingVersion: process.env.NODE_ENV === 'production' ? true : true,
        channel: isMobile ? 'MobileWeb' : 'Web',
        currencyCode,
      })
      .then((res: any) => {
        if (res?.data) setPageContents(res?.data)
      })
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
      <div className="flex w-full text-center flex-con">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {(pageContents?.metatitle ||
        pageContents?.metadescription ||
        pageContents?.metakeywords) && (
        <NextHead>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
          />
          <link
            rel="canonical"
            id="canonical"
            href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath}
          />
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
            <meta
              property="og:title"
              content={pageContents?.metatitle}
              key="ogtitle"
            />
          )}
          {pageContents?.metadescription && (
            <meta
              property="og:description"
              content={pageContents?.metadescription}
              key="ogdesc"
            />
          )}
        </NextHead>
      )}
      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <Hero banners={pageContents?.banner} />
      <div className="px-4 py-3 mx-auto lg:container sm:py-6 sm:px-4 md:px-4 lg:px-6 2xl:px-0">
        {pageContents?.heading?.map((heading: any, hId: number) => (
          <Heading
            title={heading?.heading_title}
            subTitle={heading?.heading_subtitle}
            key={`category-heading-${hId}`}
          />
        ))}
        <Categories data={pageContents?.categorylist} deviceInfo={deviceInfo} />
        {pageContents?.productheading?.map((productH: any, Pid: number) => (
          <Heading
            title={productH?.productheading_title}
            subTitle={productH?.productheading_subtitle}
            key={`product-heading-${Pid}`}
          />
        ))}
        <ProductSlider config={pageContents} deviceInfo={deviceInfo} />
      </div>

      {pageContents?.promotions?.map((banner: any, bId: number) => (
        <PromotionBanner data={banner} key={bId} css={css} />
      ))}
      <div className="px-4 py-3 mx-auto lg:container sm:px-4 lg:px-0 sm:py-6 md:px-4">
        {pageContents?.collectionheadings?.map((heading: any, cId: number) => (
          <Heading
            title={heading?.collectionheadings_title}
            subTitle={heading?.collectionheadings_subtitle}
            key={`collection-heading-${cId}`}
          />
        ))}
        <Collections data={pageContents?.collectionlist} />
      </div>
    </>
  )
}

Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)
