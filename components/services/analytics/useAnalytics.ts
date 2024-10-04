import { useCallback, useEffect } from 'react'
import { CURRENT_THEME } from '@components/utils/constants'
import AnalyticsEventManager from './AnalyticsEventManager'
//const featureToggle = require(`/public/theme/${CURRENT_THEME}/features.config.json`)

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

/**
 * useAnalytics hook
 *
 * If analytics is enabled, it provides a function to record analytics events.
 *
 * @returns {Object} an object with a single function, recordAnalytics
 * @property {function(string, Object): void} recordAnalytics - a function to record analytics events
 */
export default function useAnalytics(event?: string, data?: any) {
  const dataLayer = typeof window !== 'undefined'

  /**
   * Returns a function to record analytics events
   * @returns {function(string, Object): void} recordAnalytics function
   */
  const recordAnalytics = useCallback((event: string, data: any): void => {
    //if (!featureToggle?.features?.enableAnalytics) return

    if (dataLayer) {
      AnalyticsEventManager.dispatch(event, data)
    }
  }, [dataLayer])

  useEffect(() => {
    //console.count(`inside use effect ${dataLayer}`)
    if (dataLayer && event && data) {
      recordAnalytics(event!, data)
    }
  }, [dataLayer])

  return { recordAnalytics }
}
