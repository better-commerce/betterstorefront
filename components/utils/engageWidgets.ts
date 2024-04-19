import Cookies from 'js-cookie'
import axios from 'axios'

//
import { tryParseJson } from '@framework/utils/parse-util'
import {
  ENGAGE_QUERY_ANNOUNCEMENT,
  ENGAGE_QUERY_WEB_CAMPAIGN,
  EmptyObject,
  EmptyString,
  EngageEventTypes,
} from './constants'
import { Cookie } from '@framework/utils/constants'
import { logError } from '@framework/utils/app-util'

namespace EngageCampaignPageApi {
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

namespace EngageAnnouncementPageApi {
  export module HOME_PAGE {
    export const ALLOWED_PAGES = ['/']
    export const API = '/indexpage'
  }
  export module PRODUCT_DETAIL_PAGE {
    export const ALLOWED_PAGES = ['products']
    export const API = '/productpage'
  }
  export module PRODUCT_LISTING_PAGE {
    export const ALLOWED_PAGES = [ 'collection', 'category', 'search', 'brands' ]
    export const API = '/collectionpage'
  }
  export module CHECKOUT_PAGE {
    export const ALLOWED_PAGES = ['checkout']
    export const API = '/checkoutindexpage'
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

function getAnnouncementApiUrlByPagePath(path: string) {
  if (!path || typeof path !== 'string') return EmptyString
  // set default base url
  let announcementApiUrl = ENGAGE_QUERY_ANNOUNCEMENT
  // set API url by path
  if (pathStartsWith(path, EngageAnnouncementPageApi.PRODUCT_DETAIL_PAGE.ALLOWED_PAGES)) {
    announcementApiUrl += EngageAnnouncementPageApi.PRODUCT_DETAIL_PAGE.API
  } else if (pathStartsWith(path, EngageAnnouncementPageApi.PRODUCT_LISTING_PAGE.ALLOWED_PAGES)) {
    announcementApiUrl += EngageAnnouncementPageApi.PRODUCT_LISTING_PAGE.API
  } else if (pathStartsWith(path, EngageAnnouncementPageApi.CHECKOUT_PAGE.ALLOWED_PAGES)) {
    announcementApiUrl += EngageAnnouncementPageApi.CHECKOUT_PAGE.API
  } else if (pathStartsWith(path, EngageAnnouncementPageApi.HOME_PAGE.ALLOWED_PAGES, 0)) {
    announcementApiUrl += EngageAnnouncementPageApi.HOME_PAGE.API
  }
  return announcementApiUrl
}

export const fetchAnnouncementsByPagePath = async (path: string, { user, basketItemsCount, product }: any) => {
  try {
    const engageSession: any = tryParseJson(Cookies.get(Cookie.Key.ENGAGE_SESSION))
    const announcementApiUrl = getAnnouncementApiUrlByPagePath(path)
    if (!announcementApiUrl) return EmptyObject
    const res = await axios({
      url: announcementApiUrl,
      method: 'GET',
      params: {
        ch_guid: engageSession?.user_id,
        ch_data: JSON.stringify({
          data: {
            user_uuid: engageSession?.user_id,
            bc_user_id: user?.userId,
            cart_value: basketItemsCount,
            item_id: product?.variantGroupCode || product?.productCode || EmptyString,
          },
        }),
      },
    })
    return res?.data
  } catch (error) {
    logError(error)
  }
}
