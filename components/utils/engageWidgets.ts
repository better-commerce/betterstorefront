import Cookies from 'js-cookie'
import axios from 'axios'

//
import { tryParseJson } from '@framework/utils/parse-util'
import {
  ENGAGE_QUERY_WEB_CAMPAIGN,
  EmptyObject,
  EmptyString,
  EngageEventTypes,
} from './constants'
import { Cookie } from '@framework/utils/constants'
import { logError } from '@framework/utils/app-util'

module EngageCampaignPageApi {
  export module HOME_PAGE {
    export const ALLOWED_PAGES = ['/']
    export const API = '/indexpage/all'
  }
  export module PRODUCT_DETAIL_PAGE {
    export const ALLOWED_PAGES = ['products', 'my-store']
    export const API = '/productpage/all'
  }
  export module PRODUCT_LISTING_PAGE {
    export const ALLOWED_PAGES = [ 'collection', 'category', 'search', 'brands' ]
    export const API = '/collectionpage'
  }
  export module CHECKOUT_PAGE {
    export const ALLOWED_PAGES = ['checkout']
    export const API = '/checkoutindexpage/all'
  }
}

function pathStartsWith(currentPath: string, paths: string[], position = 1): boolean {
  return paths.some((path: string) => currentPath.startsWith(path, position))
}

function getCampaignApiUrlByPagePath(path: string) {
  if (!path || typeof path !== 'string') return EmptyString
  // set default base url
  let campaignApiUrl = ENGAGE_QUERY_WEB_CAMPAIGN
  // set API url by path
  if (pathStartsWith(path, EngageCampaignPageApi.PRODUCT_DETAIL_PAGE.ALLOWED_PAGES)) {
    campaignApiUrl += EngageCampaignPageApi.PRODUCT_DETAIL_PAGE.API
  } else if (pathStartsWith(path, EngageCampaignPageApi.PRODUCT_LISTING_PAGE.ALLOWED_PAGES)) {
    campaignApiUrl += EngageCampaignPageApi.PRODUCT_LISTING_PAGE.API
  } else if (pathStartsWith(path, EngageCampaignPageApi.CHECKOUT_PAGE.ALLOWED_PAGES)) {
    campaignApiUrl += EngageCampaignPageApi.CHECKOUT_PAGE.API
  } else if (pathStartsWith(path, EngageCampaignPageApi.HOME_PAGE.ALLOWED_PAGES, 0)) {
    campaignApiUrl += EngageCampaignPageApi.HOME_PAGE.API
  }
  return campaignApiUrl
}

export const fetchCampaignsByPagePath = async (path: string) => {
  try {
    const engageSession: any = tryParseJson(Cookies.get(Cookie.Key.ENGAGE_SESSION))
    const campaignApiUrl = getCampaignApiUrlByPagePath(path)
    if (!campaignApiUrl) return EmptyObject
    const res = await axios({
      url: campaignApiUrl,
      method: 'GET',
      params: {
        ch_guid: engageSession?.user_id,
        ch_data: JSON.stringify({ data: {} }),
      },
    })
    return res?.data
  } catch (error: any) {
    logError(error)
  }
}

export const fetchCampaignWidgetByEvent = async (event: EngageEventTypes) => {
  try {
    //    
  } catch (error) {
    logError(error)
  }
}
