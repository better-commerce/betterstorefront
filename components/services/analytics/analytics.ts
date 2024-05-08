import axios from 'axios'
import Cookies from 'js-cookie'

//
import { Cookie, OMNILYTICS_DISABLED } from '@framework/utils/constants'
import { CUSTOM_EVENTS, EVENTS_MAP } from './constants'
import { EmptyGuid, EmptyObject, EmptyString, OMNILYTICS_ASSETS_DATA, SITE_ORIGIN_URL } from '@components/utils/constants'
import { tryParseJson } from '@framework/utils/parse-util'
import setSessionIdCookie, { setGeoDataCookie } from '@components/utils/setSessionId'
import { getItem } from '@components/utils/localStorage'
import { detectDeviceType } from '@framework/utils'

const publisher = async (data: any, event: string) => {
  if (OMNILYTICS_DISABLED) return
  const windowClone: any = typeof window !== 'undefined' ? window : {}
  const navigator: any = windowClone.navigator
  const windowDataLayer = windowClone.dataLayer && windowClone.dataLayer[0]
  let geoData: any = tryParseJson(Cookies.get(Cookie.Key.GEO_ENDPOINT_DATA_CACHED))
  const pageUrl = SITE_ORIGIN_URL + new URL(windowClone?.location.href).pathname;

  setSessionIdCookie()
  geoData = await setGeoDataCookie(geoData)

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

  let dataToPublish = {
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

  try {
    const { data: analyticsData } = await axios.post(OMNILYTICS_ASSETS_DATA, { ...dataToPublish })
    if (data?.eventType === EVENTS_MAP.EVENT_TYPES.ProductViewed) {
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ProductViewed, { detail: analyticsData }))
    }
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

  const defaultAction = (payload?: any) => {
    return null
  }

  const {
    BasketItemAdded,
    BasketItemRemoved,
    BasketViewed,
    BrandViewed,
    CategoryViewed,
    CheckoutConfirmation,
    CheckoutStarted,
    CmsPageViewed,
    CollectionViewed,
    CustomerCreated,
    CustomerProfileViewed,
    CustomerUpdated,
    FacetSearch,
    FaqViewed,
    FreeText,
    PageViewed,
    ProductViewed,
    Search,
  } = EVENTS_MAP.EVENT_TYPES

  const eventHandler = function (event: any) {
    const action = event.detail.action
    const payload = event.detail.payload
    console.log(action, payload)
    switch (action) {
      case BasketItemAdded:
        addToCart(payload)
        break
      case BasketItemRemoved:
        removedFromCart(payload)
        break

      case BasketViewed:
        basketViewed(payload)
        break

      case BrandViewed:
        brandViewed(payload)
        break

      case CategoryViewed:
        categoryViewed(payload)
        break

      case CheckoutConfirmation:
        checkoutConfirmation(payload)
        break

      case CheckoutStarted:
        checkoutStarted(payload)
        break

      case CmsPageViewed:
        cmsPageViewed(payload)
        break

      case CollectionViewed:
        collectionViewed(payload)
        break

      case CustomerCreated:
        customerCreated(payload)
        break

      case CustomerProfileViewed:
        customerProfileViewed(payload)
        break

      case CustomerUpdated:
        customerUpdated(payload)
        break

      case FacetSearch:
        facetSearch(payload)
        break

      case FaqViewed:
        faqViewed(payload)
        break

      case FreeText:
        freeText(payload)
        break

      case PageViewed:
        pageViewed(payload)
        break

      case ProductViewed:
        productViewed(payload)
        break

      case Search:
        search(payload)
        break

      default:
        defaultAction(payload)
        break
    }
  }
  Object.keys(EVENTS_MAP.EVENT_TYPES).forEach((eventType: string) => {
    console.log('event listener', eventType)
    window.addEventListener(EVENTS_MAP.EVENT_TYPES[eventType], eventHandler)
  })
  return {
    removeListeners: () =>
      Object.keys(EVENTS_MAP.EVENT_TYPES).forEach((eventType: string) => {
        console.log(eventType, '=======remove')
        window.removeEventListener(
          EVENTS_MAP.EVENT_TYPES[eventType],
          eventHandler
        )
      }),
  }
}
