import GA4 from 'react-ga4'
import { GaOptions } from 'react-ga4/types/ga4'
import { GA4_DISABLED } from '@framework/utils/constants'

export enum GTMUniqueEventID {
  VIEW_ITEM_LIST = 3,
  BEGIN_CHECKOUT = 4,
  CART = 6,
  REMOVE_FROM_CART = 7,
  ADD_PAYMENT_INFO = 8,
  VIEW_ITEM = 13,
  ADD_TO_CART = 16,
  VIEW_CART = 44,
  PURCHASE = 45,
}

export const initializeGA4 = (
  measurementId: string,
  options?: {
    legacyDimensionMetric?: boolean
    nonce?: string
    testMode?: boolean
    gaOptions?: GaOptions | any
    gtagOptions?: any
  }
) => {
  GA4.initialize(measurementId, options)
}

export const recordGA4Hit = (command: string, object: any) => {
  if (!GA4_DISABLED) {
    GA4.ga(command, object)
  }
}

export const sendGA4 = (object: any) => {
  GA4.send(object)
}

export const recordGA4Event = (
  window: any,
  eventName: string,
  eventParams: any
) => {
  //GA4.event(eventName, eventParams);
  if (!GA4_DISABLED && window && window?.dataLayer) {
    try {
      window?.dataLayer?.push({
        event: eventName,
        page: eventParams,
      })
    } catch (err) {
      console.log(err)
    }
  }
}
