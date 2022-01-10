import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect, useState } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import 'swiper/css/bundle'
import Cookies from 'js-cookie'
import { v4 as uuid_v4 } from 'uuid'
import {
  SessionIdCookieKey,
  DeviceIdKey,
  NEXT_INFRA_ENDPOINT,
} from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { postData } from '@components/utils/clientFetcher'
import geoData from '@components/utils/geographicService'
import TagManager from 'react-gtm-module'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import analytics from '@components/services/analytics/analytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'

const tagManagerArgs: any = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

const Noop: FC = ({ children }) => <>{children}</>

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
const setSessionIdCookie = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionIdCookieKey) || isCalledByTimeout) {
    const expiryTime: any = new Date(new Date().getTime() + 30 * 60 * 1000)
    const sessionIdGenerator: string = uuid_v4()
    Cookies.set(SessionIdCookieKey, sessionIdGenerator, {
      expires: expiryTime,
    })
    DataLayerInstance.setItemInDataLayer(SessionIdCookieKey, sessionIdGenerator)
    setTimeout(() => {
      setSessionIdCookie(true)
    }, 1800000)
  }
}

const setDeviceIdCookie = () => {
  if (!Cookies.get(DeviceIdKey)) {
    const deviceId = uuid_v4()
    Cookies.set(DeviceIdKey, deviceId)
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
  } else {
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, Cookies.get(DeviceIdKey))
  }
}

function MyApp({ Component, pageProps, nav, footer, ...props }: any) {
  const [appConfig, setAppConfig] = useState({})
  const [location, setUserLocation] = useState({})
  const [isAnalyticsEnabled, setAnalyticsEnabled] = useState(false)
  const Layout = (Component as any).Layout || Noop

  let analyticsCb: any = {}

  const fetchAppConfig = async () => {
    try {
      const response: any = await postData(NEXT_INFRA_ENDPOINT, {
        setHeader: true,
      })
      setAppConfig(response.result)
      Cookies.set('Currency', response.defaultCurrency)
      Cookies.set('Language', response.defaultLanguage)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  const initializeGTM = () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID)
      TagManager.initialize(tagManagerArgs)
  }

  useEffect(() => {
    initializeGTM()
    document.body.classList?.remove('loading')
    fetchAppConfig()
    return function cleanup() {
      Cookies.remove(SessionIdCookieKey)
      analyticsCb.removeListeners()
    }
  }, [])

  if (typeof window !== 'undefined' && !isAnalyticsEnabled) {
    DataLayerInstance.setDataLayer()
    if (!process.env.NEXT_PUBLIC_DEVELOPMENT) {
      geoData()
        .then((response) => {
          setUserLocation(response)
          DataLayerInstance.setItemInDataLayer('ipAddress', response.Ip)
          DataLayerInstance.setItemInDataLayer('city', response.City)
          DataLayerInstance.setItemInDataLayer('country', response.Country)
        })
        .catch((err) =>
          DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
        )
    } else {
      setUserLocation(TEST_GEO_DATA)
      DataLayerInstance.setItemInDataLayer('ipAddress', TEST_GEO_DATA.Ip)
    }
    analyticsCb = analytics()
    setAnalyticsEnabled(true)
    setSessionIdCookie()
    setDeviceIdCookie()
  }

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout
          nav={nav}
          footer={footer}
          config={appConfig}
          pageProps={pageProps}
        >
          <Component {...pageProps} location={location} config={appConfig} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}

export default MyApp
