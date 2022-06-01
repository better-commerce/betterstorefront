import Cookies from 'js-cookie'
import { DefaultSessionCookieKey, SessionIdCookieKey } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { v4 as uuid_v4 } from 'uuid'

const DEFAULT_SESSION_TIMEOUT_IN_MINS = 30;

export const isValidSession = (): boolean => {
  const session = Cookies.get(DefaultSessionCookieKey);
  return (session !== undefined);
};

export const createSession = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(DefaultSessionCookieKey) || isCalledByTimeout) {
    Cookies.set(DefaultSessionCookieKey, uuid_v4(), {
      expires: getExpiry(DEFAULT_SESSION_TIMEOUT_IN_MINS),
    });

    setTimeout(() => {
      createSession(true)
    }, DEFAULT_SESSION_TIMEOUT_IN_MINS * 60 * 1000);
  }
};

const setSessionIdCookie = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionIdCookieKey) || isCalledByTimeout) {
    const sessionIdGenerator: string = uuid_v4()
    Cookies.set(SessionIdCookieKey, sessionIdGenerator, {
      expires: getExpiry(DEFAULT_SESSION_TIMEOUT_IN_MINS),
    })
    DataLayerInstance.setItemInDataLayer(SessionIdCookieKey, sessionIdGenerator)
    setTimeout(() => {
      setSessionIdCookie(true)
    }, 1800000)
  }
}

const getExpiry = (expiryInMins: number) => {
  return new Date(new Date().getTime() + expiryInMins * 60 * 1000);
};

export default setSessionIdCookie
