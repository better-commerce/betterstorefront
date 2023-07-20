import React from 'react'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { HOMEPAGE_SLUG, SITE_ORIGIN_URL } from '@components/utils/constants'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { HOME_PAGE_DEFAULT_SLUG } from '@framework/utils/constants'
import { obfuscateHostName } from '@framework/utils/app-util'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
const PromotionBanner = dynamic(
  () => import('@components/home/PromotionBanner')
)
const Heading = dynamic(() => import('@components/home/Heading'))
const Categories = dynamic(() => import('@components/home/Categories'))
const Collections = dynamic(() => import('@components/home/Collections'))
const ProductSlider = dynamic(() => import('@components/product/ProductSlider'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG })
  const slugs = await slugsPromise
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  let pageContentsWeb, pageContentsMobileWeb
  try {
    const PageContentsPromiseWeb = commerce.getPagePreviewContent({
      id: '', //pageId,
      slug: HOME_PAGE_DEFAULT_SLUG,
      workingVersion: process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
      channel: 'Web',
    })
    pageContentsWeb = await PageContentsPromiseWeb

    const PageContentsPromiseMobileWeb = commerce.getPagePreviewContent({
      id: '', //pageId,
      slug: HOME_PAGE_DEFAULT_SLUG,
      workingVersion: process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
      channel: 'MobileWeb',
    })
    pageContentsMobileWeb = await PageContentsPromiseMobileWeb
  } catch (error: any) {}

  const hostName = os.hostname()

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
      pageContentsWeb: pageContentsWeb ?? {},
      pageContentsMobileWeb: pageContentsMobileWeb ?? {},
      hostName: obfuscateHostName(hostName),
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({
  slugs,
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
  const pageContents = isMobile ? pageContentsMobileWeb : pageContentsWeb
  useAnalytics(PageViewed, {
    entity: JSON.stringify({
      id: slugs?.id,
      name: slugs?.name,
      metaTitle: slugs?.metaTitle,
      MetaKeywords: slugs?.metaKeywords,
      MetaDescription: slugs?.metaDescription,
      Slug: slugs?.slug,
      Title: slugs?.title,
      ViewType: slugs?.viewType,
    }),
    entityName: PAGE_TYPE,
    pageTitle: slugs?.title,
    entityType: 'Page',
    entityId: slugs?.id,
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
      <div className="container py-3 mx-auto sm:py-6">
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
      <div className="container px-4 py-3 mx-auto sm:px-0 sm:py-6">
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
