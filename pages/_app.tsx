import '@assets/css/base.css'
import '@assets/css/main.css'
import '@assets/icon.css'
import '@assets/css/chrome-bug.css'
import '@assets/css/checkout-frame.css'
import { FC, useEffect, useState } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext, IDeviceInfo } from '@components/ui/context'
import 'swiper/css/bundle'
import Cookies from 'js-cookie'
import { v4 as uuid_v4 } from 'uuid'
import {
  SessionIdCookieKey,
  DeviceIdKey,
  NEXT_API_KEYWORDS_ENDPOINT,
  SITE_NAME,
  SITE_ORIGIN_URL,
  INFRA_ENDPOINT,
  BETTERCOMMERCE_DEFAULT_CURRENCY,
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  NAV_ENDPOINT,
} from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import geoData from '@components/utils/geographicService'
import TagManager from 'react-gtm-module'
import analytics from '@components/services/analytics/analytics'
import setSessionIdCookie, {
  createSession,
  isValidSession,
  getExpiry,
  getMinutesInDays,
} from '@components/utils/setSessionId'
import axios from 'axios'
import { useRouter } from 'next/router'
import OverlayLoader from '@components/common/OverlayLoader'
import { resetSnippetElements } from '@framework/content/use-content-snippet'
import { ContentSnippet } from '@components/common/Content'
import NextHead from 'next/head'
import {
  Cookie,
  GA4_DISABLED,
  GA4_MEASUREMENT_ID,
} from '@framework/utils/constants'
import { initializeGA4 as initGA4 } from '@components/services/analytics/ga4'
import { DeviceType } from '@commerce/utils/use-device'
import InitDeviceInfo from '@components/common/InitDeviceInfo'
import ErrorBoundary from '@components/error'
import CustomCacheBuster from '@components/common/CustomCacheBuster'
import { version as buildVersion } from '../package.json'
import { cachedGetData } from '@framework/api/utils/cached-fetch'
import { AppContext, AppInitialProps } from 'next/app'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { tryParseJson } from '@framework/utils/parse-util'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { SessionProvider } from 'next-auth/react'
import { OMNILYTICS_DISABLED } from '@framework/utils/constants'
import CustomerReferral from '@components/customer/Referral'
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

function MyApp({ Component, pageProps, nav, footer, ...props }: any) {
  const [location, setUserLocation] = useState({ Ip: '' })
  const [isAnalyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [keywordsData, setKeywordsData] = useState([])
  const [isAppLoading, setAppIsLoading] = useState(true)
  const [language, setLanguage] = useState('')
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo>({
    isMobile: undefined,
    isDesktop: undefined,
    isIPadorTablet: undefined,
    deviceType: DeviceType.UNKNOWN,
    isOnlyMobile: undefined,
  })

  const snippets = [
    ...(pageProps?.globalSnippets ?? []),
    ...(pageProps?.snippets ?? []),
    ...(pageProps?.data?.snippets ?? []),
  ]

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

  useEffect(() => {
    const addScript = document.createElement('script')
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    if (!OMNILYTICS_DISABLED) {
      document.body.appendChild(addScript)
      ;(window as any).googleTranslateElementInit = googleTranslateElementInit
      document.getElementById('goog-gt-tt')?.remove()
    }
  }, [])

  useEffect(() => {
    // Listener for snippet injector reset.
    router.events.on('routeChangeStart', () => {
      resetSnippetElements()
    })

    // Dispose listener.
    return () => {
      router.events.off('routeChangeComplete', () => {})
    }
  }, [router.events])

  let appConfig: any = null
  if (pageProps?.appConfig) {
    appConfig = tryParseJson(decrypt(pageProps?.appConfig))
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
      Cookies.set(Cookie.Key.CURRENCY, appConfig?.defaultCurrency)
      Cookies.set(Cookie.Key.LANGUAGE, appConfig?.defaultLanguage)
    }
    fetchKeywords()

    if (!GA4_DISABLED) {
      initializeGA4()
    }
  }, [])

  useEffect(() => {
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

  const seoInfo =
    pageProps?.metaTitle ||
    pageProps?.metaDescription ||
    pageProps?.metaKeywords
      ? pageProps
      : pageProps?.data?.product || undefined

  const seoImage =
    pageProps?.metaTitle ||
    pageProps?.metaDescription ||
    pageProps?.metaKeywords
      ? pageProps?.products?.images[0]?.url
      : pageProps?.data?.product?.image || undefined

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
            <link
              rel="canonical"
              id="canonical"
              href={seoInfo?.canonicalTags || SITE_ORIGIN_URL + router.asPath}
            />
            <meta name="title" content={seoInfo?.metaTitle} />
            <meta name="description" content={seoInfo?.metaDescription} />
            <meta name="keywords" content={seoInfo?.metaKeywords} />
            {/* og meta tags */}
            <meta
              property="og:title"
              content={seoInfo?.metaTitle}
              key="ogtitle"
            />
            <meta
              property="og:description"
              content={seoInfo?.metaDescription}
              key="ogdesc"
            />
            {/* og meta tags */}
          </>
        )}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta
          property="og:url"
          content={SITE_ORIGIN_URL + router.asPath}
          key="ogurl"
        />
        <meta property="og:image" content={seoImage} />
      </NextHead>

      <Head {...appConfig}></Head>
      {OMNILYTICS_DISABLED ? null : <div id="google_translate_element" />}

      <ManagedUIContext>
        {snippets ? <ContentSnippet {...{ snippets }} /> : <></>}
        <CustomCacheBuster buildVersion={buildVersion} />
        <InitDeviceInfo setDeviceInfo={setDeviceInfo} />
        <ErrorBoundary>
          <Layout
            nav={nav}
            footer={footer}
            config={appConfig}
            pageProps={pageProps}
            keywords={keywordsData}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount(appConfig)}
          >
            <OverlayLoader />
            <CustomerReferral router={router} />
            <SessionProvider session={pageProps?.session}>
              <Component
                {...pageProps}
                location={location}
                ipAddress={location.Ip}
                config={appConfig}
                deviceInfo={deviceInfo}
              />
            </SessionProvider>
            {/* <RedirectIntercept /> */}
          </Layout>
        </ErrorBoundary>
      </ManagedUIContext>
    </>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps> => {
  const { ctx, Component } = context
  const req: any = ctx?.req
  let appConfigResult,
    navTreeResult = {
      nav: new Array(),
      footer: new Array(),
    }
  let defaultCurrency = BETTERCOMMERCE_DEFAULT_CURRENCY
  let defaultCountry = BETTERCOMMERCE_DEFAULT_COUNTRY
  let defaultLanguage = BETTERCOMMERCE_DEFAULT_LANGUAGE

  try {
    const headers = {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    }
    appConfigResult = await cachedGetData(INFRA_ENDPOINT, req?.cookies, headers)
    const languageCookie =
      req?.cookies?.Language === 'undefined' ? '' : req?.cookies?.Language

    const currencyCookie =
      req?.cookies?.Currency === 'undefined' ? '' : req?.cookies?.Currency

    const countryCookie =
      req?.cookies?.Country === 'undefined' ? '' : req?.cookies?.Country

    defaultCurrency =
      currencyCookie ||
      appConfigResult?.result?.configSettings
        .find((setting: any) => setting.configType === 'RegionalSettings')
        .configKeys.find(
          (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
        ).value ||
      BETTERCOMMERCE_DEFAULT_CURRENCY

    defaultCountry =
      countryCookie ||
      appConfigResult?.result?.configSettings
        .find((setting: any) => setting.configType === 'RegionalSettings')
        .configKeys.find(
          (item: any) => item.key === 'RegionalSettings.DefaultCountry'
        ).value ||
      BETTERCOMMERCE_DEFAULT_COUNTRY

    defaultLanguage =
      languageCookie ||
      appConfigResult?.result?.configSettings
        .find((setting: any) => setting.configType === 'RegionalSettings')
        .configKeys.find(
          (item: any) => item.key === 'RegionalSettings.DefaultLanguageCode'
        ).value ||
      BETTERCOMMERCE_DEFAULT_LANGUAGE

    const navResult = await cachedGetData(NAV_ENDPOINT, req?.cookies, headers)
    if (!navResult?.message && navResult?.errors?.length == 0) {
      navTreeResult = {
        nav: navResult?.result?.header,
        footer: navResult?.result?.footer,
      }
    }
  } catch (error: any) {}

  let appConfig = null
  if (appConfigResult) {
    const appConfigObj = {
      ...(appConfigResult?.result || {}),
      ...{
        defaultCurrency,
        defaultLanguage,
        defaultCountry,
      },
    }
    appConfig = encrypt(JSON.stringify(appConfigObj))
  }

  return {
    pageProps: {
      appConfig: appConfig,
      navTree: navTreeResult,
    },
  }
}

export default MyApp
