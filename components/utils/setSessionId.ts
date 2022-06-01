import Cookies from 'js-cookie'
import { SessionCookieKey, SessionIdCookieKey } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { v4 as uuid_v4 } from 'uuid'

export const isValidSession = (): boolean => {
  const session = Cookies.get(SessionCookieKey);
  return (session !== undefined);
};

export const createSession = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionCookieKey) || isCalledByTimeout) {
    Cookies.set(SessionCookieKey, uuid_v4(), {
      expires: getExpiry(),
    })

    setTimeout(() => {
      createSession(true)
    }, 1800000)
  }
}

const setSessionIdCookie = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionIdCookieKey) || isCalledByTimeout) {
    const sessionIdGenerator: string = uuid_v4()
    Cookies.set(SessionIdCookieKey, sessionIdGenerator, {
      expires: getExpiry(),
    })
    DataLayerInstance.setItemInDataLayer(SessionIdCookieKey, sessionIdGenerator)
    setTimeout(() => {
      setSessionIdCookie(true)
    }, 1800000)
  }
}

const getExpiry = () => {
  return new Date(new Date().getTime() + 30 * 60 * 1000);
}
export default setSessionIdCookie
