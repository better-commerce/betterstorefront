import { ENGAGE_QUERY_USER_EVENTS, ENGAGE_QUERY_USER_ITEMS, ENGAGE_TRENDING, EngageEventTypes } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { tryParseJson } from '@framework/utils/parse-util'

export default async function useGetEngageCampaignData(req: any, payload: any) {
  try {
    const chCookie: any = tryParseJson(req?.cookies?.ch_cookie)
    const { type, guid, sku }: any = payload
    let apiUrl: any
    let baseUrl: any
    let params: any = {}

    switch (type) {
      case EngageEventTypes.RECENTLY_VIEWED:
        baseUrl = ENGAGE_QUERY_USER_EVENTS
        apiUrl = '/recentitems'
        params = {
          ch_data: JSON.stringify({
            data: { user_uuid: chCookie?.user_id, exclusion_item_id: 'index', limit: 12 },
          }),
        }
        break
      case EngageEventTypes.SIMILAR_PRODUCTS:
        baseUrl = ENGAGE_QUERY_USER_ITEMS
        apiUrl = '/similaritemssorted'
        params = {
          ch_data: JSON.stringify({
            data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
          }),
        }
        break
      case EngageEventTypes.ALSO_BOUGHT:
        baseUrl = ENGAGE_QUERY_USER_ITEMS
        apiUrl = '/alsobought'
        params = {
          ch_data: JSON.stringify({
            data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
          }),
        }
        break
      case EngageEventTypes.BOUGHT_TOGETHER:
        baseUrl = ENGAGE_QUERY_USER_ITEMS
        apiUrl = '/boughttogether'
        params = {
          ch_data: JSON.stringify({
            data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
          }),
        }
        break
      case EngageEventTypes.TRENDING_FIRST_ORDER:
        baseUrl = ENGAGE_TRENDING
        apiUrl = '/byfirstorder'
        params = {
          ch_data: JSON.stringify({
            data: { limit: 12 },
          }),
        }
        break
      default:
        return {}
    }

    if (!baseUrl || !apiUrl) return {}

    const response = await fetcher({
      baseUrl,
      method: 'GET',
      url: baseUrl + apiUrl,
      headers: {
        Origin: req.headers?.host,
      },
      params: {
        ch_guid: guid,
        ch_data: params?.ch_data,
      },
    })
    return response
  } catch (error: any) {
    console.log(error)
  }
}
