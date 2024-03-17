import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@components/common'
import commerce from '@lib/api/commerce'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_DEFAULT_SLUG, HOME_PAGE_NEW_SLUG, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, obfuscateHostName, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings } from '@framework/utils/parse-util'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
const SectionHero2 = dynamic(() => import('@new-components/SectionHero/SectionHero2'))
const DiscoverMoreSlider = dynamic(() => import('@new-components/DiscoverMoreSlider'))
const SectionSliderProductCard = dynamic(() => import('@new-components/SectionSliderProductCard'))
const SectionHowItWork = dynamic(() => import('@new-components/SectionHowItWork/SectionHowItWork'))
const BackgroundSection = dynamic(() => import('@new-components/BackgroundSection/BackgroundSection'))
const SectionSliderLargeProduct = dynamic(() => import('@new-components/SectionSliderLargeProduct'))
const SectionSliderCategories = dynamic(() => import('@new-components/SectionSliderCategories/SectionSliderCategories'))
const SectionPromo3 = dynamic(() => import('@new-components/SectionPromo3'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const cachedData = await getDataByUID([Redis.Key.HomepageWeb, Redis.Key.HomepageMobileWeb,])
  const pageContentWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageWeb) || []
  const pageContentMobileWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageMobileWeb) || []
  const config = { locale, locales }
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  const promises = new Array<Promise<any>>()

  const fetchData = async (
    pageContentUIDData: any[],
    pageContentUIDKey: string,
    channel: 'Web' | 'MobileWeb'
  ) => {
    if (!containsArrayData(pageContentUIDData)) {
      infra?.currencies
        ?.map((x: any) => x?.currencyCode)
        ?.forEach((currencyCode: string, index: number) => {
          promises.push(
            new Promise(async (resolve: any, reject: any) => {
              try {
                const pageContentsPromise = commerce.getPagePreviewContent({
                  id: '',
                  slug: HOME_PAGE_NEW_SLUG,
                  workingVersion: process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
                  channel: channel,
                  currency: currencyCode,
                  cachedCopy: true,
                })
                const pageContent = await pageContentsPromise
                pageContentUIDData.push({ key: currencyCode, value: pageContent })
                await setData([{ key: pageContentUIDKey, value: pageContentUIDData }])
                resolve()
              } catch (error: any) {
                resolve()
              }
            })
          )
        })
    }
  };
  fetchData(pageContentWebUIDData, Redis.Key.HomepageWeb, 'Web');
  fetchData(pageContentMobileWebUIDData, Redis.Key.HomepageMobileWeb, 'MobileWeb');

  await Promise.all(promises)
  const slugsPromise = commerce.getSlugs({ slug: HOME_PAGE_DEFAULT_SLUG });
  const slugs = await slugsPromise;
  const hostName = os.hostname()
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
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
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)

  useEffect(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: HOME_PAGE_NEW_SLUG,
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
          {pageContents?.metadescription && (<meta name="description" content={pageContents?.metadescription} />)}
          {pageContents?.metakeywords && (<meta name="keywords" content={pageContents?.metakeywords} />)}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (<meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />)}
          {pageContents?.metadescription && (<meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />)}
        </NextHead>
      )}
      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <div className="relative overflow-hidden nc-PageHome">
        <SectionHero2 data={pageContents?.banner} />
        <div className="mt-24 lg:mt-32">
          <DiscoverMoreSlider heading={pageContents?.categoryheading} data={pageContents?.category} />
        </div>
        <div className="container relative my-24 space-y-24 lg:space-y-32 lg:my-32">
          <SectionSliderProductCard data={pageContents?.newarrivals} heading={pageContents?.newarrivalheading} />
          <div className="relative py-16 lg:py-20">
            <BackgroundSection />
            <SectionSliderCategories data={pageContents?.departments} heading={pageContents?.departmentheading} />
          </div>
          <SectionSliderLargeProduct data={pageContents?.newlookbook} heading={pageContents?.lookbookheading} cardStyle="style2" />
          <div className="py-24 border-y lg:py-32 border-slate-200 dark:border-slate-700">
            <SectionHowItWork data={pageContents?.features} />
          </div>
          <SectionPromo3 data={pageContents?.subscription} />
        </div>
      </div>
    </>
  )
}

Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)
