import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import 'swiper/css/bundle'
import Cookies from 'js-cookie'
import { v4 as uuid_v4 } from 'uuid'
import { SessionIdCookieKey, DeviceIdKey } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'

const Noop: FC = ({ children }) => <>{children}</>

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
  }
}

function MyApp({ Component, pageProps, nav, footer }: any) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    DataLayerInstance.setDataLayer()
    setSessionIdCookie()
    setDeviceIdCookie()
    document.body.classList?.remove('loading')
    return function cleanup() {
      Cookies.remove(SessionIdCookieKey)
    }
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout nav={nav} footer={footer} pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}

export default MyApp
