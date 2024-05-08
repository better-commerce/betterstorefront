import { useEffect } from 'react'
import eventDispatcher from './eventDispatcher'
import { OMNILYTICS_DISABLED } from '@framework/utils/constants'

declare global {
  interface Window {
    dataLayer: any
    ch_session: any
    ch_page_view_before: any
    ch_collection_page_view_before: any
    ch_index_page_view_before: any
    ch_add_to_cart_before: any
    ch_product_view_before: any
    ch_checkout_initiate_before: any
    ch_index_page_view_after: any
    ch_product_view_after: any
    ch_remove_from_cart_before: any
    ch_purchase_complete_before: any
  }
}

export default function useAnalytics(event: string, data: any) {
  if (OMNILYTICS_DISABLED) return
  
  // const windowClone: any = typeof window !== 'undefined' ? window : {}
  const dataLayer = typeof window !== 'undefined' && (<any>window).dataLayer && (<any>window).dataLayer[0].ipAddress

  useEffect(() => {
    //console.count(`inside use effect ${dataLayer}`)
    if (dataLayer) eventDispatcher(event, data)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLayer])
}
