import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import Layout from '@components/Layout/Layout'
import {
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import {
  Cookie,
  PRIVACY_PAGE_DEFAULT_SLUG,
  STATIC_PAGE_CACHE_INVALIDATION_IN_MINS,
} from '@framework/utils/constants'
import {
  getCurrency,
  getCurrentCurrency,
  obfuscateHostName,
  setCurrentCurrency,
} from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { AnalyticsEventType } from '@components/services/analytics'
import { serverSideMicrositeCookies } from '@commerce/utils/uri-util'
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.PRIVACY_POLICY })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug: PRIVACY_PAGE_DEFAULT_SLUG, cookies })
    
  const hostName = os.hostname()
  return {
    props: {
      ...pageProps,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
  }
}

const PAGE_TYPE = PAGE_TYPES.Privacy

function Privacy({
  setEntities,
  recordEvent,
  ipAddress,
  pageContentsWeb,
  pageContentsMobileWeb,
  hostName,
  deviceInfo,
}: any) {
  const router = useRouter()
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const translate = useTranslation()
  const PrivacyPageContents = isMobile
    ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value ||
      []
    : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(PrivacyPageContents)

  useEffect(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: PRIVACY_PAGE_DEFAULT_SLUG,
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

  useAnalytics(AnalyticsEventType.PAGE_VIEWED, { ...pageContents, entityName: PAGE_TYPE, })

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con">
        {' '}
        <Loader />{' '}
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
          <title>
            {pageContents?.metatitle || translate('label.footer.navigation.privacyPolicyText')}
          </title>
          <meta
            name="title"
            content={
              pageContents?.metatitle || translate('label.footer.navigation.privacyPolicyText')
            }
          />
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
      <div className="container mb-10">
        {pageContents?.heading?.map((head: any, Idx: any) => (
          <div key={Idx}>
            <h1 className="text-2xl sm:text-4xl mt-20 mb-10 text-center font-semibold heading-alignment">
              {head?.heading_herotitle}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: head?.heading_herodescription,
              }}
              className="terms-text break-all"
            />
          </div>
        ))}
      </div>
    </>
  )
}

Privacy.Layout = Layout
export default withDataLayer(Privacy, PAGE_TYPE)
