import '@assets/css/main.css'
import "fonts/line-awesome-1.3.0/css/line-awesome.css";
import "styles/index.scss";
import 'swiper/css/bundle'
import '@assets/css/algolia-instant-search.css'
import React, { FC, useEffect, useState } from 'react'
import { appWithTranslation } from 'next-i18next'
import jwt from 'jsonwebtoken'
import NextHead from 'next/head'
import Cookies from 'js-cookie'
import TagManager from 'react-gtm-module'
import { v4 as uuid_v4 } from 'uuid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { AppContext, AppInitialProps } from 'next/app'
import uniqBy from 'lodash/uniqBy'
import { SessionProvider } from 'next-auth/react'

import { ELEM_ATTR, ISnippet, SnippetContentType, resetSnippetElements, } from '@framework/content/use-content-snippet'
import qs from 'querystring'
import { IncomingMessage, ServerResponse } from 'http'
import { AUTH_URL, CLIENT_ID, Cookie, GA4_DISABLED, GA4_MEASUREMENT_ID, REVIEW_BASE_URL, SHARED_SECRET } from '@framework/utils/constants'
import { DeviceType } from '@commerce/utils/use-device'

import packageInfo from '../package.json'
import { cachedGetData } from '@framework/api/utils/cached-fetch'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { tryParseJson } from '@framework/utils/parse-util'
import { backToPageScrollLocation, logError, maxBasketItemsCount } from '@framework/utils/app-util'
import { OMNILYTICS_DISABLED } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'

import OverlayLoader from '@components/shared/OverlayLoader/OverlayLoader';
import { SessionIdCookieKey, DeviceIdKey, SITE_NAME, SITE_ORIGIN_URL, INFRA_ENDPOINT, BETTERCOMMERCE_DEFAULT_CURRENCY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, NAV_ENDPOINT, EmptyString, NEXT_API_KEYWORDS_ENDPOINT, EmptyObject, REVIEW_SERVICE_BASE_API, NEXT_GET_NAVIGATION, INFRA_PLUGIN_CATEGORY_ENDPOINT, PluginCategory } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import geoData from '@components/utils/geographicService'
import analytics from '@components/services/analytics/analytics'
import setSessionIdCookie, { createSession, isValidSession, getExpiry, getMinutesInDays, } from '@components/utils/setSessionId'
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
import { removeQueryString } from '@commerce/utils/uri-util';

const API_TOKEN_EXPIRY_IN_SECONDS = 3600
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
  const [keywordsData, setKeywordsData] = useState([])
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

  let snippets = [
    ...(pageProps?.globalSnippets ?? []),
    ...(pageProps?.snippets ?? []),
    ...(pageProps?.data?.snippets ?? []),
  ]
  snippets = uniqBy(snippets, 'name'); //Prevent duplicate data being passed on to snippets rendering engine.

  const router = useRouter()
  const Layout = (Component as any).Layout || Noop
  let googleTranslateElementInit: any
  //ACTIVATE ONLY OMNILYTICS ENABLED
  if (!OMNILYTICS_DISABLED) {
    googleTranslateElementInit = () => {
      const windowClone: any = window
      new windowClone.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout:
            windowClone.google.translate.TranslateElement.FloatPosition
              .TOP_LEFT,
        },
        'google_translate_element'
      )

      const selector = "iframe[name='votingFrame']"
      const elem = document.querySelector(selector)
      if (elem) {
        elem.setAttribute('title', 'Google Voting Frame')
      }
    }
  }

  const setClientIPAddress = (pageProps: any) => {
    if (pageProps?.clientIPAddress) {
      Cookies.set(Cookie.Key.CLIENT_IP_ADDRESS, pageProps?.clientIPAddress)
    }
  }

  useEffect(() => {
    setNavTree()
    setClientIPAddress(pageProps)
    const addScript = document.createElement('script')
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    if (!OMNILYTICS_DISABLED) {
      document.body.appendChild(addScript)
        ; (window as any).googleTranslateElementInit = googleTranslateElementInit
      document.getElementById('goog-gt-tt')?.remove()
    }
  }, [])

  const setNavTree = async () => {
    const { data: navResult }: any = await axios.get(NEXT_GET_NAVIGATION)
    const { nav = [], footer = [] } = navResult
    if (nav?.length || footer?.length) {
      const updatedPageProps = { ...pageProps, navTree: navResult }
      setUpdatedPageProps(updatedPageProps)
    }
  }

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

  const fetchKeywords = async function () {
    try {
      const { data }: any = await axios.get(NEXT_API_KEYWORDS_ENDPOINT)
      setKeywordsData(data.result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
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
    fetchKeywords()

    if (!GA4_DISABLED) {
      initializeGA4()
    }
  }, [])

  useEffect(() => {
    setTopHeadJSSnippets(snippets?.filter((x: ISnippet) => x?.placement === 'TopHead' && x?.type === SnippetContentType.JAVASCRIPT))
    setHeadJSSnippets(snippets?.filter((x: ISnippet) => x?.placement === 'Head' && x?.type === SnippetContentType.JAVASCRIPT))
    DataLayerInstance.setDataLayer()

    // If browser session is not yet started.
    if (!isValidSession()) {
      // Initiate a new browser session.
      createSession()

      if (!process.env.NEXT_PUBLIC_DEVELOPMENT) {
        geoData()
          .then((response) => {
            DataLayerInstance.setItemInDataLayer('ipAddress', response.Ip)
            DataLayerInstance.setItemInDataLayer('city', response.City)
            DataLayerInstance.setItemInDataLayer('country', response.Country)
            setUserLocation(response)
            setAppIsLoading(false)
          })
          .catch((err) => {
            DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
          })
      } else {
        DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
        DataLayerInstance.setItemInDataLayer('ipAddress', TEST_GEO_DATA.Ip)
        setUserLocation(TEST_GEO_DATA)
        setAppIsLoading(false)
      }
    } else {
      setAppIsLoading(false)
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
                <link rel="canonical" href={seoInfo?.canonicalTags || SITE_ORIGIN_URL + cleanPath} />
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
        <meta property="og:url" content={SITE_ORIGIN_URL + cleanPath} key="ogurl" />
        <meta property="og:image" content={seoImage} />
        {headElements}
      </NextHead>

      <Head {...appConfig}></Head>
      {OMNILYTICS_DISABLED ? null : <div id="google_translate_element" />}

      <ManagedUIContext>
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
        <ErrorBoundary>
          <Layout nav={nav} footer={footer} config={appConfig} pluginConfig={pluginConfig} pageProps={updatedPageProps} keywords={keywordsData} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(appConfig)} >
            <div ref={bodyStartScrCntrRef} className={`${ELEM_ATTR}body-start-script-cntr`} ></div>
            <OverlayLoader />
            <CustomerReferral router={router} />
            <SessionProvider session={pageProps?.session}>
              <Component
                {...pageProps}
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
      </ManagedUIContext>
    </>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps> => {
  /**
   * Generates a new auth token.
   * @param authUrl
   * @param clientId
   * @param sharedSecret
   * @returns
   */
  const generateToken = async (
    authUrl: string,
    clientId: string,
    sharedSecret: string
  ) => {
    const url = new URL('oAuth/token', authUrl)
    const { data: tokenResult } = await axios({
      url: url.href,
      method: 'post',
      data: `client_id=${clientId}&client_secret=${sharedSecret}&grant_type=client_credentials`,
    })
    return tokenResult?.access_token
  }

  /**
   * Manages auth token used for securing Next.js API routes.
   * @param req
   * @returns
   */
  const getToken = async (req: any) => {
    let token = EmptyString
    const cookies = qs.decode(req?.headers?.cookie, '; ')
    if (cookies[Cookie.Key.API_TOKEN]) {
      token = cookies[Cookie.Key.API_TOKEN] as string
      const jwtResult: any = jwt.decode(decrypt(token))
      if (jwtResult?.exp) {
        const expiryTime = jwtResult?.exp * 1000
        const nowTime = new Date().getTime()

        if (nowTime >= expiryTime) {
          // Generate new token
          token = await generateToken(AUTH_URL!, CLIENT_ID!, SHARED_SECRET!)
        }
      }
    } else {
      // Generate new token
      token = await generateToken(AUTH_URL!, CLIENT_ID!, SHARED_SECRET!)
    }
    return token
  }

  const { ctx, Component } = context
  const { locale } = ctx
  const req: any = ctx?.req
  const res: ServerResponse<IncomingMessage> | undefined = ctx?.res

  /**
   * TODO: [GS, 08-Sep-23]: `res?.setHeader()` throws error intermittently in Next.js PRODUCTION release.
   * This issue is not replicated in DEV mode.
   *
   * Temporarily commenting this logic to resolve the above issue. This snippet assists [AuthToken] generation
   * and therefore passed-on to [API RouteGuard] that ensures no external entity is able to access
   * Next.js app's APIs apart from the app itself.  The [AuthToken] is generated server-side and stored in
   * encoded format in form of a cookie (valid for 60 mins). The [RouteGuard] validates the token in incoming request's
   * cookies for authorization.
   *
   * The RouteGuard logic will still work as it has another level of checking the source (referrer)
   * from where the API call has been initiated.
   */
  /*const token = await getToken(req)
  if (token) {
    res?.setHeader(
      'Set-Cookie',
      `${Cookie.Key.API_TOKEN}=${encrypt(
        token
      )}; Path=/; Max-Age=${API_TOKEN_EXPIRY_IN_SECONDS};`
    )
  }*/

  let clientIPAddress = req?.ip ?? req?.headers['x-real-ip']
  const forwardedFor = req?.headers['x-forwarded-for']
  if (!clientIPAddress && forwardedFor) {
    clientIPAddress = forwardedFor.split(',').at(0) ?? ''
  }

  let appConfigResult, navTreeResult = { nav: new Array(), footer: new Array(), }
  let defaultCurrency = BETTERCOMMERCE_DEFAULT_CURRENCY
  let defaultCountry = BETTERCOMMERCE_DEFAULT_COUNTRY
  let defaultLanguage = BETTERCOMMERCE_DEFAULT_LANGUAGE

  const headers = { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, }
  try {
    appConfigResult = await cachedGetData(INFRA_ENDPOINT, req?.cookies, headers)
    const languageCookie = req?.cookies?.Language === 'undefined' ? '' : req?.cookies?.Language
    const currencyCookie = req?.cookies?.Currency === 'undefined' ? '' : req?.cookies?.Currency
    const countryCookie = req?.cookies?.Country === 'undefined' ? '' : req?.cookies?.Country
    defaultCurrency = appConfigResult?.result?.configSettings?.find((setting: any) => setting?.configType === 'RegionalSettings')?.configKeys?.find((item: any) => item?.key === 'RegionalSettings.DefaultCurrencyCode')?.value || currencyCookie || BETTERCOMMERCE_DEFAULT_CURRENCY
    defaultCountry = appConfigResult?.result?.configSettings?.find((setting: any) => setting?.configType === 'RegionalSettings')?.configKeys?.find((item: any) => item?.key === 'RegionalSettings.DefaultCountry')?.value || countryCookie || BETTERCOMMERCE_DEFAULT_COUNTRY
    defaultLanguage = appConfigResult?.result?.configSettings?.find((setting: any) => setting?.configType === 'RegionalSettings')?.configKeys?.find((item: any) => item?.key === 'RegionalSettings.DefaultLanguageCode')?.value || languageCookie || BETTERCOMMERCE_DEFAULT_LANGUAGE
  } catch (error: any) { }

  let appConfig = null
  if (appConfigResult) {
    const { result: appConfigData } = appConfigResult
    const { configSettings, shippingCountries, billingCountries, currencies, languages, snippets, } = appConfigData
    const appConfigObj = {
      ...{
        configSettings: configSettings?.filter((x: any) => ['B2BSettings', 'BasketSettings', 'ShippingSettings'].includes(x?.configType)) || [],
        shippingCountries,
        billingCountries,
        currencies,
        languages,
        snippets,
      },
      ...{ defaultCurrency, defaultLanguage, defaultCountry, },
    }
    appConfig = encrypt(JSON.stringify(appConfigObj))
  }

  let reviewData: any = EmptyObject
  try {
    const res: any = await fetcher({
      baseUrl: REVIEW_BASE_URL,
      url: `${REVIEW_SERVICE_BASE_API}/summary`,
      method: 'post',
      cookies: {},
    })
    reviewData = res?.Result
  } catch (error: any) {
    logError(error)
  }

  let pluginConfig = new Array<any>()
  const socialLoginConfigUrl = `${INFRA_PLUGIN_CATEGORY_ENDPOINT}?categoryCode=${PluginCategory.SOCIAL_LOGIN}`
  try {
    const socialLoginConfig: any = await cachedGetData(socialLoginConfigUrl, req?.cookies, headers)
    if (socialLoginConfig?.result) {
      pluginConfig = pluginConfig?.concat(socialLoginConfig?.result)
    }
  } catch (error: any) {
    logError(error)
  }

  return {
    pageProps: {
      appConfig: appConfig,
      pluginConfig: encrypt(JSON.stringify(pluginConfig)),
      navTree: navTreeResult,
      clientIPAddress: clientIPAddress,
      reviewData: reviewData,
      locale,
    },
  }
}

export default appWithTranslation(MyApp)