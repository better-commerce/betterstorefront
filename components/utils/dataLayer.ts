import Cookies from 'js-cookie'
import { SessionIdCookieKey } from '@components/utils/constants'
import geoData from '@components/utils/geographicService'
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

const getIpAddress = () => {
  /* to be provided an endpoint */
  return '81.196.3.222'
}

const DataLayerSingleton = function () {
  const windowObject: any = window
  const navigator: any = windowObject.navigator
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      navigator.userAgent.toLowerCase()
    )

  const isMobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent.toLowerCase()
    )

  let deviceType = 'desktop'
  if (isTablet) deviceType = 'tablet'
  if (isMobile) deviceType = 'mobile'
  const setDataLayer = () => {
    const dataLayer = {
      sessionId: Cookies.get(SessionIdCookieKey),
      BrowserInfo: navigator.userAgent,
      deviceType: deviceType,
      channel: 'Web',
      lang: 'en-GB',
      domainId: process.env.NEXT_PUBLIC_DOMAIN_ID || '',
      ipAddress: getIpAddress(),
      orgId: process.env.NEXT_PUBLIC_ORG_ID,
      server: 'x.x.x.29',
      visitorAffiliate: '',
      visitorEmail: null,
      visitorExistingCustomer: false,
      visitorId: '',
      visitorLoggedIn: false,
      visitorSegment: '',
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

  return { setItemInDataLayer, getItemFromDataLayer, setDataLayer, setEntities }
}

let DataLayerInstance: any = null

if (typeof window !== 'undefined') {
  DataLayerInstance = DataLayerSingleton()
  Object.freeze(DataLayerInstance)
}

export default DataLayerInstance
