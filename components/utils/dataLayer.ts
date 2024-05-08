import Cookies from 'js-cookie'
import { EmptyGuid, EmptyObject, EmptyString, SessionIdCookieKey } from '@components/utils/constants'
import { Cookie, DeviceType } from '@framework/utils/constants'
import { getItem } from './localStorage'

export const ACTIONS = {
  DynamicPage: 'DynamicPage',
  SearchFull: 'SearchFull',
  ProductDetail: 'ProductDetail',
  index: 'index',
}

export const EVENTS = {
  BasketItemAdded: 'BasketItemAdded',
  BasketItemRemoved: 'BasketItemRemoved',
  BasketViewed: 'BasketViewed',
  BlogViewed: 'BlogViewed',
  BrandViewed: 'BrandViewed',
  CategoryViewed: 'CategoryViewed',
  CheckoutConfirmation: 'CheckoutConfirmation',
  CheckoutStarted: 'CheckoutStarted',
  CmsPageViewed: 'CmsPageViewed',
  CollectionViewed: 'CollectionViewed',
  CustomerCreated: 'CustomerCreated',
  CustomerProfileViewed: 'CustomerProfileViewed',
  CustomerUpdate: 'CustomerUpdated',
  FacetSearch: 'FacetSearch',
  FaqViewed: 'FaqViewed',
  FreeText: 'FreeText',
  PageViewed: 'PageViewed',
  ProductViewed: 'ProductViewed',
  Search: 'Search',
}

export const KEYS_MAP = {
  entityId: 'entityId',
  entityName: 'entityName',
  entityType: 'entityType',
  entity: 'entity',
  eventType: 'eventType',
}

const DataLayerSingleton = function () {
  const windowObject: any = typeof window !== 'undefined' ? window : {}
  const visitorData: any = getItem('user') || EmptyObject

  const detectDeviceType = (userAgent = navigator.userAgent) => {
    // RegExp for device types
    const mobileRegex = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i;
    const iosRegex = /iPhone|iPod/i;
    const androidRegex = /Android/i;
    const windowsPhoneRegex = /Windows Phone/i;
    const tabletRegex = /iPad|Android(?!.+(?:mobile|mobi)).*?(?:Tablet|Tab)/i;
  
    if (iosRegex.test(userAgent)) {
      return DeviceType.IOS;
    } else if (androidRegex.test(userAgent)) {
      return DeviceType.ANDROID;
    } else if (windowsPhoneRegex.test(userAgent)) {
      return DeviceType.WINDOWS_PHONE;
    } else if (tabletRegex.test(userAgent)) {
      return DeviceType.TABLET;
    } else if (mobileRegex.test(userAgent)) {
      return DeviceType.MOBILE;
    } else {
      return DeviceType.DESKTOP;
    }
  }

  const setDataLayer = () => {
    const dataLayer = {
      sessionId: Cookies.get(Cookie.Key.SESSION_ID),
      browserInfo: navigator.userAgent,
      deviceType: detectDeviceType(),
      channel: 'Web',
      lang: Cookies.get(Cookie.Key.LANGUAGE),
      domainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      appId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      ipAddress: EmptyString,
      orgId: process.env.NEXT_PUBLIC_ORG_ID,
      server: EmptyString,
      visitorAffiliate: EmptyString,
      visitorEmail: visitorData?.email || EmptyString,
      visitorExistingCustomer: Boolean(visitorData?.username),
      visitorId: visitorData?.userId || EmptyGuid,
      visitorLoggedIn: Boolean(visitorData?.email),
      visitorSegment: EmptyString,
    }
    if (!windowObject.dataLayer) {
      windowObject.dataLayer = [dataLayer]
    }
  }

  const getItemFromDataLayer = (item: any) => windowObject.dataLayer[0][item]

  const setItemInDataLayer = (item: any, value: any) => {
    setDataLayer()
    windowObject.dataLayer[0][item] = value
  }

  const setEntities = (entities: any) => {
    setDataLayer()
    Object.keys(entities).forEach((item: string) => {
      windowObject.dataLayer[0][item] = entities[item]
    })
  }

  return {
    setItemInDataLayer,
    getItemFromDataLayer,
    setDataLayer,
    setEntities,
    dataLayer: windowObject.dataLayer,
  }
}

let DataLayerInstance: any = null

if (typeof window !== 'undefined') {
  DataLayerInstance = DataLayerSingleton()
  Object.freeze(DataLayerInstance)
}

export default DataLayerInstance
