import { EVENTS_MAP } from './constants'
export default function AnalyticsService() {
  const addToCart = (payload: any) => {
    console.log(payload)
    console.log('log item add to cart')
  }
  const removedFromCart = (payload: any) => {
    console.log('item removed from cart')
  }
  const basketViewed = (payload: any) => {
    console.log('BasketViewed')
  }

  const brandViewed = (payload: any) => {
    console.log('BrandViewed')
  }

  const categoryViewed = (payload: any) => {
    console.log('CategoryViewed')
  }

  const checkoutConfirmation = (payload: any) => {
    console.log('CheckoutConfirmation')
  }

  const checkoutStarted = (payload: any) => {
    console.log('CheckoutStarted')
  }

  const cmsPageViewed = (payload: any) => {
    console.log('CmsPageViewed')
  }

  const collectionViewed = (payload: any) => {
    console.log('CollectionViewed')
  }

  const customerCreated = (payload: any) => {
    console.log('CustomerCreated')
  }

  const customerProfileViewed = (payload: any) => {
    console.log('CustomerProfileViewed')
  }

  const customerUpdated = (payload: any) => {
    console.log('CustomerUpdated')
  }
  const facetSearch = (payload: any) => {
    console.log('FacetSearch')
  }
  const faqViewed = (payload: any) => {
    console.log('FaqViewed')
  }
  const freeText = (payload: any) => {
    console.log('FreeText')
  }
  const pageViewed = (payload: any) => {
    console.log('PageViewed')
  }
  const productViewed = (payload: any) => {
    console.log('ProductViewed')
  }
  const search = (payload: any) => {
    console.log('Search')
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
    console.log(action)
    console.log(payload)
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
