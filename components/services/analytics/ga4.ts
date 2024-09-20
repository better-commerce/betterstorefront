import { GA4_DISABLED } from "@framework/utils/constants"

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
