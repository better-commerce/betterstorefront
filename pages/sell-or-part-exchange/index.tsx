import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { EmptyGuid, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS, TRADE_IN_PAGE_ID, TRADE_IN_PAGE_SLUG } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, isB2BUser, maxBasketItemsCount, obfuscateHostName, sanitizeRelativeUrl, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings, } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Layout from '@components/Layout/Layout'
import { useUI } from '@components/ui/context'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { Guid } from '@commerce/types';
import { AnalyticsEventType } from '@components/services/analytics'
import Link from 'next/link'
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
declare const window: any

export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const hostName = os.hostname()
  let slug = TRADE_IN_PAGE_SLUG;
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.HOME })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })

  return {
    props: {
      ...pageProps,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function SellOrPartExchange({ setEntities, recordEvent, ipAddress, pageContentsWeb, pageContentsMobileWeb, config, hostName, deviceInfo, campaignData, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const { user, isGuestUser } = useUI()
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const translate = useTranslation()
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)

  useEffect(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: TRADE_IN_PAGE_SLUG,
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

  useEffect(() => {
    if (typeof window !== "undefined" && window?.ch_session) {
      window.ch_index_page_view_before({ item_id: "index", bc_user_id: user?.userId || EmptyGuid })
    }
  }, [])

  useAnalytics(AnalyticsEventType.PAGE_VIEWED, { ...pageContents, entityName: PAGE_TYPES.Home, })

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con"> <Loader /> </div>
    )
  }

  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + cleanPath} />
          <title>{pageContents?.metatitle || translate('common.label.homeText')}</title>
          <meta name="title" content={pageContents?.metatitle || translate('common.label.homeText')} />
          {pageContents?.metadescription && (<meta name="description" content={pageContents?.metadescription} />)}
          {pageContents?.metakeywords && (<meta name="keywords" content={pageContents?.metakeywords} />)}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (<meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />)}
          {pageContents?.metadescription && (<meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />)}
        </NextHead>
      )}

      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <div className="relative overflow-hidden bg-[#f8f8f8] nc-PageHome homepage-main dark:bg-white">
        <div className='container flex flex-col justify-center gap-4 mx-auto text-center'>
          {pageContents?.heroheading?.length > 0 && pageContents?.heroheading?.map((heading: any, hIdx: number) => (
            <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8' key={`heading-${hIdx}`}>
              <h1 className='mb-4 text-xl font-semibold uppercase sm:text-3xl text-[#2d4d9c] sm:mb-6'>{heading?.heroheading_title}</h1>
            </div>
          ))}
          {pageContents?.sellguide?.length > 0 &&
            <div className='grid grid-cols-1 gap-6 mb-4 sm:grid-cols-3 sm:mb-8'>
              {
                pageContents?.sellguide?.map((step: any, stepIdx: number) => (
                  <div className='flex flex-col justify-center w-full gap-4 p-4 text-center rounded bg-[#2d4d9c] sm:p-6' key={`sell-${stepIdx}`}>
                    <img src={step?.sellguide_image} className='w-auto h-16' alt={step?.sellguide_title} />
                    <h3 className='text-xl font-semibold text-white uppercase'>{step?.sellguide_title}</h3>
                    <div className='text-xl font-normal text-white' dangerouslySetInnerHTML={{ __html: step?.sellguide_description }}></div>
                  </div>
                ))
              }
            </div>
          }
          {pageContents?.sellingdescription != "" && <div className='w-full mx-auto mb-4 text-xl font-normal text-black sm:w-10/12 sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: pageContents?.sellingdescription }}></div>}
          {pageContents?.guide?.length > 0 &&
            <div className='flex flex-col w-full'>
              {pageContents?.guide?.map((data: any, dataIdx: number) => (
                <div className='flex flex-col w-full' key={`guide-${dataIdx}`}>
                  <iframe src={data?.guide_videolink} frameBorder={0} className='w-full mx-auto h-[580px]'></iframe>
                  <div className='flex flex-col justify-start w-full p-6 mt-6 bg-white border border-gray-200'>
                    <h3 className='text-3xl font-semibold text-[#2d4d9c] uppercase'>{data?.guide_title}</h3>
                    <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.guide_guidedescription }}></div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
        {pageContents?.service?.length > 0 &&
          <div className='flex flex-col w-full mt-6 bg-white sm:mt-8'>
            {pageContents?.service?.map((data: any, dataIdx: number) => (
              <div className='container flex items-center w-full gap-10 mx-auto justify-normal' key={`service-${dataIdx}`}>
                <div><img src={data?.service_image} className='w-48 h-auto' alt={data?.service_title} /></div>
                <div className='flex flex-col justify-start w-full p-6 mt-6'>
                  <h3 className='text-2xl font-semibold text-[#2d4d9c] uppercase'>{data?.service_title}</h3>
                  <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.service_description }}></div>
                  <div className='flex flex-1'>
                    <Link href={data?.service_buttonlink} passHref legacyBehavior>
                      <a className='flex items-center justify-center h-10 px-6 text-xs font-medium text-center text-white uppercase bg-[#2d4d9c] hover:bg-sky-900 rounded'>{data?.service_buttontext}</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </>
  )
}
SellOrPartExchange.Layout = Layout
export default withDataLayer(SellOrPartExchange, PAGE_TYPE)