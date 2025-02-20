// Base Imports
import React, { FC, useCallback, useEffect, useState, useMemo } from 'react'

// Package Imports
import os from 'os'
import Cookies from 'js-cookie'
import NextHead from 'next/head'
import { v4 as uuid_v4 } from 'uuid'
import { useRouter } from 'next/router'
import TagManager from 'react-gtm-module'
import { SessionProvider } from 'next-auth/react'
import { AppContext, AppInitialProps } from 'next/app'
import { IncomingMessage, ServerResponse } from 'http'

// Component Imports
import Loader from '@components/Loader'
import Head from '@components/shared/Head/Head';
import InitDeviceInfo from '@components/shared/InitDeviceInfo';
import BrowserNavigation from '@components/shared/routing/BrowserNavigation';
import ErrorBoundary from '@components/shared/error';
import CustomCacheBuster from '@components/shared/CustomCacheBuster';
import CustomerReferral from '@components/customer/Referral';
import OverlayLoader from '@components/shared/OverlayLoader/OverlayLoader';
import { ContentSnippetInjector } from '@components/common/Content'

// Other Imports
import '@assets/css/main.css'
import "fonts/line-awesome-1.3.0/css/line-awesome.css";
import "styles/index.scss";
import 'swiper/css/bundle'
import packageInfo from '../package.json'
import { decrypt, } from '@framework/utils/cipher'
import { stringToBoolean, tryParseJson } from '@framework/utils/parse-util'
import { backToPageScrollLocation, logError, maxBasketItemsCount } from '@framework/utils/app-util'
import PasswordProtectedRoute from '@components/route/PasswordProtectedRoute'
import '@assets/css/algolia-instant-search.css'
import { Cookie, } from '@framework/utils/constants'
import { DeviceType } from '@commerce/utils/use-device'
import { resetSnippetElements, } from '@framework/content/use-content-snippet'
import { SessionIdCookieKey, DeviceIdKey, SITE_NAME, SITE_ORIGIN_URL, EmptyString, } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import geoData from '@components/utils/geographicService'
import analytics from '@components/services/analytics/omnilytics'
import setSessionIdCookie, { createSession, isValidSession, getExpiry, getMinutesInDays, setGeoDataCookie, } from '@components/utils/setSessionId'
import { ManagedUIContext, IDeviceInfo } from '@components/ui/context'
import { CURRENT_THEME } from "@components/utils/constants";
import { fetchCampaignsByPagePath } from '@components/utils/engageWidgets';
import { hasBaseUrl, isMicrosite, removeQueryString } from '@commerce/utils/uri-util';
import { I18nProvider } from '@components/ui/i18nContext';
import { i18nLocalization } from 'framework/utils/app-util';
import { getCurrencySymbol } from '@framework/utils/translate-util'
import { Guid } from '@commerce/types'
declare const window: any
const featureToggle = require(`../public/theme/${CURRENT_THEME}/features.config.json`);

const tagManagerArgs: any = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

const Noop: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <>{children}</>
)

const TEST_GEO_DATA = { Ip: '81.196.3.147', Country: 'Romania', CountryCode: 'RO', City: 'Bucharest', CityCode: 'B', DetailJson: null, Message: null, IsValid: false, }

const setDeviceIdCookie = () => {
  if (!Cookies.get(DeviceIdKey)) {
    const deviceId = uuid_v4()
    Cookies.set(DeviceIdKey, deviceId, { expires: getExpiry(getMinutesInDays(365)), })
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
  } else {
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, Cookies.get(DeviceIdKey))
  }
}

export const SCROLLABLE_LOCATIONS = [ '/collection/', '/brands/', '/category/', '/kit/' ]

function MyApp({ Component, pageProps, nav, footer, clientIPAddress, ...props }: any) {
  const [location, setUserLocation] = useState({ Ip: '' })
  const [isAnalyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [isAppLoading, setAppIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>({ isMobile: undefined, isDesktop: undefined, isIPadorTablet: undefined, deviceType: DeviceType.UNKNOWN, isOnlyMobile: undefined, })
  const [updatedPageProps, setUpdatedPageProps] = useState({ ...pageProps, featureToggle })
  const [campaignData, setCampaignData] = useState()

  const keywordsData = pageProps?.keywords || []
  const snippets = [ ...(pageProps?.globalSnippets ?? []), ...(pageProps?.snippets ?? []), ...(pageProps?.data?.snippets ?? []), ]
  //snippets = uniqBy(snippets, 'name'); //Prevent duplicate data being passed on to snippets rendering engine.

  const router = useRouter()
  const routePath = useMemo(() => router.asPath, [router.asPath])
  const Layout = (Component as any).Layout || Noop
  const setClientIPAddress = (pageProps: any) => {
    if (pageProps?.clientIPAddress) {
      Cookies.set(Cookie.Key.CLIENT_IP_ADDRESS, pageProps?.clientIPAddress)
    }
  }
  const i18n = i18nLocalization(pageProps?.locale || EmptyString)
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
    router.events.on('routeChangeComplete', (url: any) => { 
      if (url === '/password-protection') {
        setPasswordProtectionLoader(false)
      }

      if (isScrollEnabled) {
        backToPageScrollLocation(window.location) 
      }
    })

    // Dispose listener.
    return () => {
      router.events.off('routeChangeStart', () => { })
      //if (isScrollEnabled) {
      router.events.off('routeChangeComplete', () => { })
      //}
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

  useEffect(() => {
    const microsite = router?.query?.microsite || EmptyString
    initializeGTM()
    document.body.classList?.remove('loading')
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
    if (featureToggle?.features?.enableOmnilytics) {
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (typeof window !== 'undefined' && window.document) {
        // Ensure the React Developer Tools global hook exists
        if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) return;
        const devtoolsHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        // Replace all global hook properties with a no-op function or a null value
        for (const prop in devtoolsHook) {
          if (prop === 'renderers') {
            // prevents console error when dev tools try to iterate of renderers
            devtoolsHook[prop] = new Map();
            continue;
          }
          devtoolsHook[prop] = typeof devtoolsHook[prop] === 'function' ? Function.prototype : null;
        }
      }
    }
  }, [])

  const [showPasswordProtectionLoader, setPasswordProtectionLoader] = useState(true)

  useEffect(() => {
    if (appConfig && routePath) {

      let configSettings: any
      let isPasswordProtectionEnabled: boolean = true, isAuthenticated = false
      if (appConfig) {
        configSettings = appConfig?.configSettings
        if (configSettings) {
          const passwordProtectionSettings = configSettings?.find((x: any) => x?.configType === 'PasswordProtectionSettings')?.configKeys || []
          isPasswordProtectionEnabled = stringToBoolean(passwordProtectionSettings?.find((x: any) => x?.key === 'PasswordProtectionSettings.LivePasswordEnabled')?.value || 'False')
        }
      }
      if (configSettings) {
        const passwordProtectionSettings = configSettings?.find((x: any) => x?.configType === 'PasswordProtectionSettings')?.configKeys || []
        isPasswordProtectionEnabled = stringToBoolean(passwordProtectionSettings?.find((x: any) => x?.key === 'PasswordProtectionSettings.LivePasswordEnabled')?.value || 'False')
    
        //const authenticated = Cookies.get(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH}`)
        const authenticated = localStorage.getItem(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH}`)!
        isAuthenticated = stringToBoolean(authenticated)
        
        if (!router.pathname.startsWith('/password-protection') && isPasswordProtectionEnabled && !isAuthenticated) {
          const isStarted = localStorage.getItem(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH_STARTED}`)
          if (!isStarted) {
            localStorage.setItem(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH_STARTED}`, 'true')
            router.push('/password-protection')
          }
        } else {
          setPasswordProtectionLoader(false)
        }
      }


      //const microsite = isMicrosite(routePath)
      const microsite = isMicrosite(pageProps?.locale || EmptyString)
      if (microsite && microsite?.id && microsite?.id !== Guid.empty) {
        Cookies.set(Cookie.Key.MICROSITE_ID, microsite?.id)
        Cookies.set(Cookie.Key.CURRENCY, microsite?.defaultCurrencyCode)
        Cookies.set(Cookie.Key.CURRENCY_SYMBOL, getCurrencySymbol(microsite?.defaultCurrencyCode))
        Cookies.set(Cookie.Key.LANGUAGE, microsite?.defaultLangCulture)
        Cookies.set(Cookie.Key.COUNTRY, microsite?.countryCode)
      } else {
        const micrositeId = Cookies.get(Cookie.Key.MICROSITE_ID)
        if (micrositeId) {
          Cookies.remove(Cookie.Key.MICROSITE_ID)
          Cookies.remove(Cookie.Key.CURRENCY)
          Cookies.remove(Cookie.Key.CURRENCY_SYMBOL)
          Cookies.remove(Cookie.Key.LANGUAGE)
          Cookies.remove(Cookie.Key.COUNTRY)
        }

        const currency = Cookies.get(Cookie.Key.CURRENCY)
        const country = Cookies.get(Cookie.Key.COUNTRY)
        const language = Cookies.get(Cookie.Key.LANGUAGE)
        const isForceLangChanged = (language && pageProps?.locale != language)

        // If any of the required cookies is undefined
        if ((!currency || !country || !language) || isForceLangChanged) {
          const currencyCode = /*Cookies.get(Cookie.Key.CURRENCY) ||*/ appConfig?.defaultCurrency || EmptyString
          Cookies.set(Cookie.Key.CURRENCY, currencyCode)
          const currencySymbol = appConfig?.currencies?.find((x: any) => x?.currencyCode === currencyCode)?.currencySymbol || EmptyString
          Cookies.set(Cookie.Key.CURRENCY_SYMBOL, currencySymbol)
          const languageCulture = /*appConfig?.languages?.find((x: any) => x?.languageCulture === Cookies.get(Cookie.Key.LANGUAGE))?.languageCulture ||*/ pageProps?.locale || EmptyString
          Cookies.set(Cookie.Key.LANGUAGE, languageCulture)
          Cookies.set(Cookie.Key.COUNTRY, languageCulture?.substring(3))

          if (isForceLangChanged) {
            router.reload()
          }
        }
      }
      setTimeout(() => {
        setIsInitialized(true)
      }, 200);
    }
  }, [appConfig, routePath])

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
    if (featureToggle?.features?.enableOmnilytics) {
      fetchEngageCampaigns()
    }
  }, [router.asPath])

  const seoInfo = pageProps?.metaTitle || pageProps?.metaDescription || pageProps?.metaKeywords ? pageProps : pageProps?.data?.product || undefined
  const seoImage = pageProps?.metaTitle || pageProps?.metaDescription || pageProps?.metaKeywords ? pageProps?.products?.images?.[0]?.url : pageProps?.data?.product?.image || undefined
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {seoInfo && (
          <>
            <title>{seoInfo?.metaTitle}</title>
            {
              router.asPath.startsWith('/products/') && (
                // <link rel="canonical" href={(seoInfo?.canonicalTags != "" || seoInfo?.canonicalTags != null) ? (!hasBaseUrl(seoInfo?.canonicalTags) ? SITE_ORIGIN_URL + "/" + seoInfo?.canonicalTags : seoInfo?.canonicalTags) : SITE_ORIGIN_URL +  cleanPath} />
                <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
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
      </NextHead>

      <Head {...appConfig}></Head>
      {showPasswordProtectionLoader && <Loader backdropInvisible={true} message={''} />}
      {<ContentSnippetInjector snippets={snippets} />}
      {!isInitialized && <Loader backdropInvisible={true} message={EmptyString} />}
      <ManagedUIContext>
          <CustomCacheBuster buildVersion={packageInfo?.version} />
          <InitDeviceInfo setDeviceInfo={setDeviceInfo} />
          {
            (deviceInfo && (deviceInfo.isDesktop || deviceInfo.isMobile || deviceInfo.isIPadorTablet)) && (
              <BrowserNavigation deviceInfo={deviceInfo} />
            )
          }
          <I18nProvider value={i18n}>
            <ErrorBoundary>
              <Layout nav={nav} footer={footer} config={appConfig} pluginConfig={pluginConfig} pageProps={updatedPageProps} keywords={keywordsData} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(appConfig)}>
                <OverlayLoader />
                <CustomerReferral router={router} />
                <SessionProvider session={pageProps?.session}>
                  <Component {...{...pageProps, featureToggle}} campaignData={campaignData} location={location} ipAddress={location.Ip} config={appConfig} pluginConfig={pluginConfig} deviceInfo={deviceInfo} />
                </SessionProvider>
              </Layout>
            </ErrorBoundary>
          </I18nProvider>
      </ManagedUIContext>
    </>
  )
}

MyApp.getInitialProps = async (context: AppContext): Promise<AppInitialProps> => {

  const { ctx, Component } = context
  const { locale } = ctx
  const req: any = ctx?.req
  const res: ServerResponse<IncomingMessage> | undefined = ctx?.res

  let clientIPAddress = req?.ip ?? req?.headers['x-real-ip']
  const forwardedFor = req?.headers['x-forwarded-for']
  if (!clientIPAddress && forwardedFor) {
    clientIPAddress = forwardedFor.split(',').at(0) ?? ''
  }
  const serverHost = os?.hostname?.()
  const urlReferrer = req?.headers?.referer
  //const cookies: any = { [Cookie.Key.LANGUAGE]: locale }
  
  return {
    pageProps: { serverHost, urlReferrer, clientIPAddress, locale, },
  }
}

export default MyApp