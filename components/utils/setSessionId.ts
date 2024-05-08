import Cookies from 'js-cookie'
import { DefaultSessionCookieKey, EmptyString, SessionIdCookieKey } from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { v4 as uuid_v4 } from 'uuid'
import geoData from './geographicService';
import { Cookie } from '@framework/utils/constants';

/**
 * Environment constant for default time out value.
 */
const NEXT_PUBLIC_DEFAULT_SESSION_TIMEOUT_IN_MINS = Number(process.env.NEXT_PUBLIC_DEFAULT_SESSION_TIMEOUT_IN_MINS) || 30;

/**
 * Returns TRUE for valid browser session.
 * @returns 
 */
export const isValidSession = (): boolean => {
  const session = Cookies.get(DefaultSessionCookieKey);
  return (session !== undefined);
};

/**
 * Initiates a new browser session.
 * @param isCalledByTimeout 
 */
export const createSession = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(DefaultSessionCookieKey) || isCalledByTimeout) {
    Cookies.set(DefaultSessionCookieKey, uuid_v4(), {
      expires: getExpiry(NEXT_PUBLIC_DEFAULT_SESSION_TIMEOUT_IN_MINS),
    });

    setTimeout(() => {
      createSession(true)
    }, NEXT_PUBLIC_DEFAULT_SESSION_TIMEOUT_IN_MINS * 60 * 1000);
  }
};

const setSessionIdCookie = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionIdCookieKey) || isCalledByTimeout) {
    const sessionIdGenerator: string = uuid_v4()
    Cookies.set(SessionIdCookieKey, sessionIdGenerator, {
      expires: getExpiry(NEXT_PUBLIC_DEFAULT_SESSION_TIMEOUT_IN_MINS),
    })
    DataLayerInstance.setItemInDataLayer(SessionIdCookieKey, sessionIdGenerator)
    setTimeout(() => {
      setSessionIdCookie(true)
    }, 1800000)
  }
}

export const setGeoDataCookie = async (geoDataInfo: any) => {
  if (!geoDataInfo) {
    const geoResult: any = await geoData(EmptyString)
    setGeoDataCookie(geoResult)
    return
  }
  if (!Cookies.get(Cookie.Key.GEO_ENDPOINT_DATA_CACHED) || geoDataInfo) {
    Cookies.set(Cookie.Key.GEO_ENDPOINT_DATA_CACHED, JSON.stringify(geoDataInfo), {
      expires: getExpiry(3),
    })
    DataLayerInstance.setItemInDataLayer('ipAddress', geoDataInfo?.Ip || EmptyString)
    DataLayerInstance.setItemInDataLayer('city', geoDataInfo?.City || EmptyString)
    DataLayerInstance.setItemInDataLayer('country', geoDataInfo?.Country || EmptyString)
  }
  return geoDataInfo
}

/**
 * Returns computed expiry date time value depending on {expiryInMins}.
 * @param expiryInMins 
 * @returns 
 */
export const getExpiry = (expiryInMins: number) => {
  return new Date(new Date().getTime() + expiryInMins * 60 * 1000);
};

export const getMinutesInDays = (days: number) => {
  return days * 24 * 60;
}

export default setSessionIdCookie
