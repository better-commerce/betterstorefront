import { EVENTS_MAP } from './constants'
import axios from 'axios'

const endpoint = 'https://omnilytics.omnicx.com/data'

const publisher = async (data: any, event: string) => {
  const windowClone: any = typeof window !== 'undefined' ? window : {}
  const dataLayer = windowClone.dataLayer[0]

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

  let dataToPublish = {
    dataLayer: { ...dataLayer, data },
    deviceType: dataLayer.deviceType,
    ipAddress: dataLayer.ipAddress,
    event,
    session: null,
    trackerId: process.env.NEXT_PUBLIC_OMNILYTICS_ID,
    url: window.location.href,
    utmCampaign: getQueryStringValue('utm_campaign'),
    utmMedium: getQueryStringValue('utm_medium'),
    utmSource: getQueryStringValue('utm_source'),
    utmContent: getQueryStringValue('utm_content'),
    utmTerm: getQueryStringValue('utm_term'),
  }

  try {
    await axios.post(endpoint, { ...dataToPublish })
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
    console.log('CategoryViewed')
  }

  const checkoutConfirmation = (payload: any) => {
    publisher(payload, 'checkoutConfirmation')
  }

  const checkoutStarted = (payload: any) => {
    publisher(payload, ' checkoutStarted')
  }

  const cmsPageViewed = (payload: any) => {
    console.log('CmsPageViewed')
  }

  const collectionViewed = (payload: any) => {
    console.log('CollectionViewed')
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

  const eventHandler = function (action: string, payload: any) {
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
  if (typeof window !== 'undefined') {
    Object.keys(EVENTS_MAP.EVENT_TYPES).forEach((eventType: string) => {
      window.addEventListener(EVENTS_MAP.EVENT_TYPES[eventType], (event: any) =>
        eventHandler(event.detail.action, event.detail.payload)
      )
    })
  }
}
