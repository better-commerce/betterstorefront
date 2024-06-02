import '@assets/css/main.css'
import "fonts/line-awesome-1.3.0/css/line-awesome.css";
import "styles/index.scss";
import 'swiper/css/bundle'
import '@assets/css/algolia-instant-search.css'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { appWithTranslation } from 'next-i18next'
import NextHead from 'next/head'
import Cookies from 'js-cookie'
import TagManager from 'react-gtm-module'
import { v4 as uuid_v4 } from 'uuid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { AppContext, AppInitialProps } from 'next/app'
import uniqBy from 'lodash/uniqBy'
import { SessionProvider } from 'next-auth/react'
import os from 'os'

import { ELEM_ATTR, ISnippet, SnippetContentType, resetSnippetElements, } from '@framework/content/use-content-snippet'
import { IncomingMessage, ServerResponse } from 'http'
import { Cookie, GA4_DISABLED, GA4_MEASUREMENT_ID, } from '@framework/utils/constants'
import { DeviceType } from '@commerce/utils/use-device'

import packageInfo from '../package.json'
import { decrypt, } from '@framework/utils/cipher'
import { tryParseJson } from '@framework/utils/parse-util'
import { backToPageScrollLocation, logError, maxBasketItemsCount } from '@framework/utils/app-util'
import { OMNILYTICS_DISABLED } from '@framework/utils/constants'
import PasswordProtectedRoute from '@components/route/PasswordProtectedRoute'
import OverlayLoader from '@components/shared/OverlayLoader/OverlayLoader';
import { SessionIdCookieKey, DeviceIdKey, SITE_NAME, SITE_ORIGIN_URL, EmptyString, NEXT_API_KEYWORDS_ENDPOINT, ENGAGE_QUERY_WEB_CAMPAIGN, NEXT_GET_NAVIGATION } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import geoData from '@components/utils/geographicService'
import analytics from '@components/services/analytics/analytics'
import setSessionIdCookie, { createSession, isValidSession, getExpiry, getMinutesInDays, setGeoDataCookie, } from '@components/utils/setSessionId'
import { initializeGA4 as initGA4 } from '@components/services/analytics/ga4'
import { ManagedUIContext, IDeviceInfo } from '@components/ui/context'
import Head from '@components/shared/Head/Head';
import NonHeadContentSnippet from '@components/shared/Snippet/NonHeadContentSnippet';
import { IScriptSnippet } from '@components/shared/Snippet/ScriptContentSnippet';
import InitDeviceInfo from '@components/shared/InitDeviceInfo';
import BrowserNavigation from '@components/shared/routing/BrowserNavigation';
import ErrorBoundary from '@components/shared/error';
import CustomCacheBuster from '@components/shared/CustomCacheBuster';
import CustomerReferral from '@components/customer/Referral';
import { CURRENT_THEME } from "@components/utils/constants";
import { fetchCampaignsByPagePath } from '@components/utils/engageWidgets';
import { hasBaseUrl, removeQueryString } from '@commerce/utils/uri-util';
import { I18nProvider } from '@components/ui/i18nContext';
import { i18nLocalization } from 'framework/utils/app-util';
const featureToggle = require(`../public/theme/${CURRENT_THEME}/features.config.json`);

const tagManagerArgs: any = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

const Noop: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <>{children}</>
)

const TEST_GEO_DATA = {
  Ip: '81.196.3.147',
  Country: 'Romania',
  CountryCode: 'RO',
  City: 'Bucharest',
  CityCode: 'B',
  DetailJson: null,
  Message: null,
  IsValid: false,
}

const setDeviceIdCookie = () => {
  if (!Cookies.get(DeviceIdKey)) {
    const deviceId = uuid_v4()
    Cookies.set(DeviceIdKey, deviceId, {
      expires: getExpiry(getMinutesInDays(365)),
    })
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
  } else {
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, Cookies.get(DeviceIdKey))
  }
}

export const SCROLLABLE_LOCATIONS = [
  '/collection/',
  '/brands/',
  '/category/',
  '/kit/'
]

function MyApp({ Component, pageProps, nav, footer, clientIPAddress, ...props }: any) {
  const [location, setUserLocation] = useState({ Ip: '' })
  const [isAnalyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [isAppLoading, setAppIsLoading] = useState(true)
  const [language, setLanguage] = useState('')
  const [topHeadJSSnippets, setTopHeadJSSnippets] = useState(new Array<any>())
  const [headJSSnippets, setHeadJSSnippets] = useState(new Array<any>())
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>({
    isMobile: undefined,
    isDesktop: undefined,
    isIPadorTablet: undefined,
    deviceType: DeviceType.UNKNOWN,
    isOnlyMobile: undefined,
  })
  const [updatedPageProps, setUpdatedPageProps] = useState(pageProps)
  const [campaignData, setCampaignData] = useState()

  const keywordsData = pageProps?.keywords || []
  let snippets = [
    ...(pageProps?.globalSnippets ?? []),
    ...(pageProps?.snippets ?? []),
    ...(pageProps?.data?.snippets ?? []),
  ]
  snippets = uniqBy(snippets, 'name'); //Prevent duplicate data being passed on to snippets rendering engine.

  const router = useRouter()
  const Layout = (Component as any).Layout || Noop
  const setClientIPAddress = (pageProps: any) => {
    if (pageProps?.clientIPAddress) {
      Cookies.set(Cookie.Key.CLIENT_IP_ADDRESS, pageProps?.clientIPAddress)
    }
  }
  const i18n = i18nLocalization(pageProps?.locale || EmptyString)

  const setNavTree = useCallback(async () => {
    const { data: navResult }: any = await axios.get(NEXT_GET_NAVIGATION)
    const { nav = [], footer = [] } = navResult
    if (nav?.length || footer?.length) {
      const newPageProps = { ...updatedPageProps, navTree: navResult }
      setUpdatedPageProps(newPageProps)
    }
  }, [])


  const fetchEngageCampaigns = useCallback(async () => {
    try {
      const campaignRes = await fetchCampaignsByPagePath(router.asPath)
      setCampaignData(campaignRes)
    } catch (error: any) {
      logError(error)
    }
  }, [router.asPath])

  useEffect(() => {
    let urlReferrer = pageProps?.urlReferrer || document.referrer
    if (urlReferrer) {
      urlReferrer = SITE_ORIGIN_URL + new URL(pageProps?.urlReferrer || document.referrer).pathname;
      DataLayerInstance.setItemInDataLayer('urlReferrer', urlReferrer)
    }
  }, [pageProps?.urlReferrer])

  useEffect(() => {
    // Listener for snippet injector reset.
    router.events.on('routeChangeStart', () => {
      setClientIPAddress(pageProps)
      resetSnippetElements()
    })

    const isScrollEnabled = SCROLLABLE_LOCATIONS.find((x: string) => window.location.pathname.startsWith(x))
    if (isScrollEnabled) {
      router.events.on('routeChangeComplete', () => {
        backToPageScrollLocation(window.location)
      })
    }

    // Dispose listener.
    return () => {
      router.events.off('routeChangeStart', () => { })
      if (isScrollEnabled) {
        router.events.off('routeChangeComplete', () => { })
      }
    }
  }, [router.events])

  let appConfig: any = null
  if (pageProps?.appConfig) {
    appConfig = tryParseJson(decrypt(pageProps?.appConfig))
  }

  let pluginConfig: any = null
  if (pageProps?.pluginConfig) {
    pluginConfig = tryParseJson(decrypt(pageProps?.pluginConfig))
  }

  const initializeGTM = () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID)
      TagManager.initialize(tagManagerArgs)
  }

  const initializeGA4 = () => {
    if (GA4_MEASUREMENT_ID) {
      initGA4(GA4_MEASUREMENT_ID)
    }
  }

  useEffect(() => {
    setNavTree()
    initializeGTM()
    document.body.classList?.remove('loading')
    if (appConfig) {
      const currencyCode = Cookies.get(Cookie.Key.CURRENCY) || appConfig?.defaultCurrency || EmptyString
      Cookies.set(Cookie.Key.CURRENCY, currencyCode)
      const currencySymbol = appConfig?.currencies?.find((x: any) => x?.currencyCode === currencyCode)?.currencySymbol || EmptyString
      Cookies.set(Cookie.Key.CURRENCY_SYMBOL, currencySymbol)
      const languageCulture = appConfig?.languages?.find((x: any) => x?.languageCulture === Cookies.get(Cookie.Key.LANGUAGE))?.languageCulture || pageProps?.locale || EmptyString
      Cookies.set(Cookie.Key.LANGUAGE, languageCulture)
      Cookies.set(Cookie.Key.COUNTRY, languageCulture?.substring(3))
    }

    if (!GA4_DISABLED) {
      initializeGA4()
    }
  }, [])

  useEffect(() => {
    setTopHeadJSSnippets(snippets?.filter((x: ISnippet) => x?.placement === 'TopHead' && x?.type === SnippetContentType.JAVASCRIPT))
    setHeadJSSnippets(snippets?.filter((x: ISnippet) => x?.placement === 'Head' && x?.type === SnippetContentType.JAVASCRIPT))
  }, [])

  useEffect(() => {
    DataLayerInstance.setDataLayer()
    DataLayerInstance.setItemInDataLayer('server', pageProps?.serverHost || EmptyString)
    // If browser session is not yet started.
    if (!isValidSession()) {
      // Initiate a new browser session.
      createSession()
    } else {
      setAppIsLoading(false)
    }
    if (!OMNILYTICS_DISABLED) {
      setGeoData()
    }
    let analyticsCb = analytics()
    setAnalyticsEnabled(true)
    setSessionIdCookie()
    setDeviceIdCookie()
    return function cleanup() {
      analyticsCb.removeListeners()
      Cookies.remove(SessionIdCookieKey)
    }
  }, [])

  const setGeoData = async () => {
    try {
      const geoResult: any = await geoData(EmptyString)
      if (geoResult) {
        setGeoDataCookie(geoResult)
        setUserLocation(geoResult)
        setAppIsLoading(false)
      }
    } catch (error) {
      setAppIsLoading(false)
    }
  }

  useEffect(() => {
    if (!OMNILYTICS_DISABLED) {
      fetchEngageCampaigns()
    }
  }, [router.asPath])

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
  const seoInfo = pageProps?.metaTitle || pageProps?.metaDescription || pageProps?.metaKeywords ? pageProps : pageProps?.data?.product || undefined
  const seoImage = pageProps?.metaTitle || pageProps?.metaDescription || pageProps?.metaKeywords ? pageProps?.products?.images[0]?.url : pageProps?.data?.product?.image || undefined
  const bodyStartScrCntrRef = React.createRef<any>()
  const bodyEndScrCntrRef = React.createRef<any>()
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        {topHeadElements}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {seoInfo && (
          <>
            <title>{seoInfo?.metaTitle}</title>
            {
              router.asPath.startsWith('/products/') && (
                <link rel="canonical" href={(seoInfo?.canonicalTags != "" || seoInfo?.canonicalTags != null) ? (!hasBaseUrl(seoInfo?.canonicalTags) ? SITE_ORIGIN_URL + "/" + seoInfo?.canonicalTags : seoInfo?.canonicalTags) : SITE_ORIGIN_URL +  cleanPath} />
                // <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
              )
            }
            <meta name="title" content={seoInfo?.metaTitle} />
            <meta name="description" content={seoInfo?.metaDescription} />
            <meta name="keywords" content={seoInfo?.metaKeywords} />
            <meta property="og:title" content={seoInfo?.metaTitle} key="ogtitle" />
            <meta property="og:description" content={seoInfo?.metaDescription} key="ogdesc" />
          </>
        )}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + router.asPath} key="ogurl" />
        <meta property="og:image" content={seoImage} />
        {headElements}
      </NextHead>

      <Head {...appConfig}></Head>
      <ManagedUIContext>
        <PasswordProtectedRoute config={appConfig}>
          {(snippets?.length > 0) && (
            <NonHeadContentSnippet snippets={snippets} refs={{ bodyStartScrCntrRef, bodyEndScrCntrRef }} />
          )}
          <CustomCacheBuster buildVersion={packageInfo?.version} />
          <InitDeviceInfo setDeviceInfo={setDeviceInfo} />
          {
            (deviceInfo && (deviceInfo.isDesktop || deviceInfo.isMobile || deviceInfo.isIPadorTablet)) && (
              <BrowserNavigation deviceInfo={deviceInfo} />
            )
          }
          <I18nProvider value={i18n}>
            <ErrorBoundary>
              <Layout nav={nav} footer={footer} config={appConfig} pluginConfig={pluginConfig} pageProps={updatedPageProps} keywords={keywordsData} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(appConfig)} >
                <div ref={bodyStartScrCntrRef} className={`${ELEM_ATTR}body-start-script-cntr`} ></div>
                <OverlayLoader />
                <CustomerReferral router={router} />
                <SessionProvider session={pageProps?.session}>
                  <Component
                    {...pageProps}
                    campaignData={campaignData}
                    location={location}
                    ipAddress={location.Ip}
                    config={appConfig}
                    pluginConfig={pluginConfig}
                    deviceInfo={deviceInfo}
                  />
                </SessionProvider>
                <div ref={bodyEndScrCntrRef} className={`${ELEM_ATTR}body-end-script-cntr`} ></div>
              </Layout>
            </ErrorBoundary>
          </I18nProvider>
        </PasswordProtectedRoute>
      </ManagedUIContext>
    </>
  )
}

MyApp.getInitialProps = async (context: AppContext): Promise<AppInitialProps> => {

  const { ctx, Component } = context
  const { locale } = ctx
  const req: any = ctx?.req
  const res: ServerResponse<IncomingMessage> | undefined = ctx?.res

  let navTreeResult = { nav: new Array(), footer: new Array(), }
  let clientIPAddress = req?.ip ?? req?.headers['x-real-ip']
  const forwardedFor = req?.headers['x-forwarded-for']
  if (!clientIPAddress && forwardedFor) {
    clientIPAddress = forwardedFor.split(',').at(0) ?? ''
  }
  const serverHost = os.hostname()
  const urlReferrer = req?.headers?.referer

  return {
    pageProps: {
      serverHost,
      urlReferrer,
      navTree: navTreeResult,
      clientIPAddress,
      locale,
      featureToggle,
    },
  }
}

export default MyApp