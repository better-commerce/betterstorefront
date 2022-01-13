import Cookies from 'js-cookie'
import { SessionIdCookieKey } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { v4 as uuid_v4 } from 'uuid'

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
export default setSessionIdCookie
