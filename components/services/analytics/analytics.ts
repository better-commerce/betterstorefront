import axios from 'axios'
import Cookies from 'js-cookie'

//
import { Cookie, } from '@framework/utils/constants'
import { CUSTOM_EVENTS, EVENTS_MAP } from './constants'
import { CURRENT_THEME, EmptyGuid, EmptyObject, EmptyString, OMNILYTICS_ASSETS_DATA, SITE_ORIGIN_URL } from '@components/utils/constants'
import { tryParseJson } from '@framework/utils/parse-util'
import setSessionIdCookie, { setGeoDataCookie } from '@components/utils/setSessionId'
import { getItem } from '@components/utils/localStorage'
import { detectDeviceType } from '@framework/utils'
import { AnalyticsEventType } from '.'
import { OMNILYTICS_EVENTS } from './events/omnilytics'
const featureToggle = require(`/public/theme/${CURRENT_THEME}/features.config.json`)

/**
 * Publisher function to send analytics events to configured analytics providers
 * @param {any} data The payload of the event
 * @param {string} event The type of event to be sent
 * @returns {Promise<void>}
 */
const publisher = async (data: any, event: string) => {
  if (!featureToggle?.features?.enableOmnilytics) return
  const windowClone: any = typeof window !== 'undefined' ? window : {}
  const navigator: any = windowClone.navigator
  const windowDataLayer = windowClone.dataLayer && windowClone.dataLayer[0]
  const geoData: any = tryParseJson(Cookies.get(Cookie.Key.GEO_ENDPOINT_DATA_CACHED))
  const pageUrl = SITE_ORIGIN_URL + new URL(windowClone?.location.href).pathname;

  setSessionIdCookie()

  const getQueryStringValue = function (n: string) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          '^(?:.*[&\\?]' +
            encodeURIComponent(n).replace(/[\.\+\*]/g, '\\$&') +
            '(?:\\=([^&]*))?)?.*$',
          'i'
        ),
        '$1'
      )
    )
  }

  const visitorData: any = getItem('user') || EmptyObject

  const _getOmniImage = function () {
    var t = '',
      n: any = document.getElementsByClassName('omni-img')
    return (
      n && n[0]
        ? (t = n[0].src)
        : ((n = document.getElementsByTagName('img')),
          (t = n.length > 0 ? n[0].src : null)),
      t
    )
  }

  const _cloneNavigator = function () {
    var t = window.navigator,
      i = Object.keys(Object.getPrototypeOf(t))
    return i.reduce(function (n, i) {
      return (windowClone[i] = windowClone[i]), n
    }, {})
  }

  const getBrowserData = () => {
    return {
      cookies: document.cookie,
      dimensions: {
        documentHeight: Math.max(
          document.body.scrollHeight,
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.body.offsetHeight,
          document.body.clientHeight
        ),
        documentWidth: Math.max(
          document.body.scrollWidth,
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.body.offsetWidth,
          document.body.clientWidth
        ),
        screenHeight: screen.height,
        screenWidth: screen.width,
        windowHeight: document.body.clientHeight,
        windowWidth: document.body.clientWidth,
      },
      navigator: _cloneNavigator(),
      timing: window.performance.timing,
    }
  }

  const sendEventData = async (geoData?: any) => {
    const dataToPublish = {
      dataLayer: {
        ...windowDataLayer,
        ...data,
        utmCampaign: getQueryStringValue('utm_campaign'),
        utmMedium: getQueryStringValue('utm_medium'),
        utmSource: getQueryStringValue('utm_source'),
        utmContent: getQueryStringValue('utm_content'),
        utmTerm: getQueryStringValue('utm_term'),
        pageUrl,
        urlReferrer: windowDataLayer?.urlReferrer || document.referrer,
        currency: Cookies.get(Cookie.Key.CURRENCY),
        visitorEmail: visitorData?.email || EmptyString,
        visitorExistingCustomer: Boolean(visitorData?.username),
        visitorId: visitorData?.userId || EmptyGuid,
        visitorLoggedIn: Boolean(visitorData?.email),
        dataLayer: JSON.stringify({
          ...JSON.parse(data?.entity || '{}'),
          omniImg: data?.omniImg || _getOmniImage(),
        }),
        data: JSON.stringify(getBrowserData()),
        pageTitle: document.title,
        sessionId: Cookies.get(Cookie.Key.SESSION_ID),
        orgId: process.env.NEXT_PUBLIC_ORG_ID,
        appId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        domainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        deviceType: detectDeviceType(),
        channel: 'Web',
        lang: Cookies.get(Cookie.Key.LANGUAGE),
        browserInfo: navigator.userAgent,
        city: geoData?.City || EmptyString,
        country: geoData?.Country || EmptyString,
        ipAddress: geoData?.Ip || EmptyString,
      },
      deviceType: detectDeviceType(),
      ipAddress: geoData?.Ip || EmptyString,
      event,
      session: Cookies.get(Cookie.Key.SESSION_ID),
      trackerId: process.env.NEXT_PUBLIC_OMNILYTICS_ID,
      url: pageUrl,
    }
    const { data: analyticsData } = await axios.post(OMNILYTICS_ASSETS_DATA, { ...dataToPublish })
    if (data?.eventType === AnalyticsEventType.PDP_VIEW) {
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ProductViewed, { detail: analyticsData }))
    }
  }

  try {
    if (!geoData) setGeoDataCookie(geoData).then(sendEventData)
    else sendEventData(geoData)
  } catch (error) {
    console.log(error)
  }
}

export default function AnalyticsService() {
  const addToCart = (payload: any) => {
    publisher(payload, 'addToCart')
  }
  const removedFromCart = (payload: any) => {
    publisher(payload, 'removedFromCart')
  }
  const basketViewed = (payload: any) => {
    publisher(payload, 'basketViewed')
  }

  const brandViewed = (payload: any) => {
    publisher(payload, 'brandViewed')
  }

  const categoryViewed = (payload: any) => {
    publisher(payload, 'categoryViewed')
  }

  const checkoutConfirmation = (payload: any) => {
    publisher(payload, 'checkoutConfirmation')
  }

  const checkoutStarted = (payload: any) => {
    publisher(payload, 'checkoutStarted')
  }

  const cmsPageViewed = (payload: any) => {
    console.log('CmsPageViewed')
  }

  const collectionViewed = (payload: any) => {
    publisher(payload, 'collectionViewed')
  }

  const customerCreated = (payload: any) => {
    publisher(payload, 'customerCreated')
  }

  const customerProfileViewed = (payload: any) => {
    publisher(payload, 'customerProfileViewed')
  }

  const customerUpdated = (payload: any) => {
    publisher(payload, 'customerUpdated')
  }
  const facetSearch = (payload: any) => {
    publisher(payload, 'facetSearch')
  }
  const faqViewed = (payload: any) => {
    console.log('FaqViewed')
  }
  const freeText = (payload: any) => {
    console.log('FreeText')
  }
  const pageViewed = (payload: any) => {
    publisher(payload, 'pageLoad')
  }
  const productViewed = (payload: any) => {
    publisher(payload, 'productViewed')
  }
  const search = (payload: any) => {
    publisher(payload, 'search')
  }
  const passwordProtection = (payload: any) => {
    publisher(payload, 'passwordProtection')
  }

  const defaultAction = (payload?: any) => {
    return null
  }

  const eventHandler = function (event: any) {
    const action = event.detail.action
    const payload = event.detail.payload
    console.log(action, payload)
    switch (action) {
      case AnalyticsEventType.ADD_TO_BASKET:
        addToCart(payload)
        break
      case AnalyticsEventType.REMOVE_FROM_CART:
        removedFromCart(payload)
        break

      case AnalyticsEventType.VIEW_BASKET:
        basketViewed(payload)
        break

      case AnalyticsEventType.BRAND_VIEWED:
        brandViewed(payload)
        break

      case AnalyticsEventType.CATEGORY_VIEWED:
        categoryViewed(payload)
        break

      case AnalyticsEventType.CHECKOUT_CONFIRMATION:
        checkoutConfirmation(payload)
        break

      case AnalyticsEventType.BEGIN_CHECKOUT:
        checkoutStarted(payload)
        break

      case AnalyticsEventType.CMS_PAGE_VIEWED:
        cmsPageViewed(payload)
        break

      case AnalyticsEventType.VIEW_PLP_ITEMS:
        collectionViewed(payload)
        break

      case AnalyticsEventType.CUSTOMER_CREATED:
        customerCreated(payload)
        break

      case AnalyticsEventType.CUSTOMER_PROFILE_VIEWED:
        customerProfileViewed(payload)
        break

      case AnalyticsEventType.CUSTOMER_UPDATED:
        customerUpdated(payload)
        break

      case AnalyticsEventType.FACET_SEARCH:
        facetSearch(payload)
        break

      case AnalyticsEventType.FAQ_VIEWED:
        faqViewed(payload)
        break

      case AnalyticsEventType.FREE_TEXT:
        freeText(payload)
        break

      case AnalyticsEventType.PAGE_VIEWED:
        pageViewed(payload)
        break

      case AnalyticsEventType.PDP_VIEW:
        productViewed(payload)
        break
      
      case AnalyticsEventType.PASSWORD_PROTECTION:
        passwordProtection(payload)
        break

      case AnalyticsEventType.SEARCH:
        search(payload)
        break

      default:
        defaultAction(payload)
        break
    }
  }
  Object.keys(OMNILYTICS_EVENTS.eventTypes).forEach((eventType: string) => {
    console.log('event listener', eventType)
    const eventTypes: any = OMNILYTICS_EVENTS.eventTypes
    window.addEventListener(eventTypes[eventType], eventHandler)
  })
  return {
    removeListeners: () =>
      Object.keys(OMNILYTICS_EVENTS.eventTypes).forEach((eventType: string) => {
        console.log(eventType, '=======remove')
        const eventTypes: any = OMNILYTICS_EVENTS.eventTypes
        window.removeEventListener(
          eventTypes[eventType],
          eventHandler
        )
      }),
  }
}
