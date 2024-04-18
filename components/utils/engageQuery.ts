import { EmptyGuid, EmptyString, EngageEventTypes } from './constants'

export const getReqPayload = (rData?: any) => {
  const { type, chCookie, limit, product, currentCampaign = {}, user } = rData
  const sku = product?.variantGroupCode || product?.productCode || EmptyString
  let payload: any = { data: { user_uuid: chCookie?.user_id } }

  if (user?.userId && user?.userId !== EmptyGuid) {
    payload = { data: { ...payload.data, bc_user_id: user?.userId } }
  }

  // set request payload
  switch (type) {
    case EngageEventTypes.ALSO_BOUGHT:
    case EngageEventTypes.BOUGHT_TOGETHER:
      payload = {
        data: { ...payload.data, current_item_ids: [sku], limit },
      }
      break
    case EngageEventTypes.COLLAB_ITEM_VIEW:
      payload = {
        data: { ...payload.data, item_id: sku, limit },
      }
      break
    case EngageEventTypes.COLLAB_USER_ITEMS_VIEW:
      payload = {
        data: { ...payload.data },
      }
      break
    case EngageEventTypes.COLLAB_ITEM_PURCHASE:
      payload = {
        data: { ...payload.data, item_ids: [sku], limit },
      }
      break
    case EngageEventTypes.TRENDING_FIRST_ORDER:
    case EngageEventTypes.RECENTLY_VIEWED:
      payload = {
        data: {
          ...payload.data,
          exclusion_item_id: 'index',
          limit,
          source: {
            campaign_uuid: currentCampaign.campaign_uuid,
            component_type: currentCampaign.component_type,
            campaign_type: currentCampaign.campaign_type,
          },
        },
      }
      break
    case EngageEventTypes.SIMILAR_PRODUCTS:
    case EngageEventTypes.SIMILAR_PRODUCTS_SORTED:
      payload = {
        data: {
          ...payload.data,
          current_item_id: sku,
          base_category: product?.classification?.category?.toLowerCase() || EmptyString,
          limit,
          source: {
            campaign_uuid: currentCampaign.campaign_uuid,
            component_type: currentCampaign.component_type,
            campaign_type: currentCampaign.campaign_type,
          },
        },
      }
      break
    case EngageEventTypes.INTEREST_USER_ITEMS:
      payload = {
        data: {
          ...payload.data,
          primary_category_type: 'categories_1',
          secondary_category_type: EmptyString,
          retry: false,
          limit,
        },
      }
      break
    case EngageEventTypes.TRENDING_COLLECTION:
      payload = {
        data: {
          ...payload.data,
          page_id: 'mini_dress',
          limit,
        },
      }
      break
    case EngageEventTypes.COUPON_COLLECTION:
      payload = {
        data: {
          ...payload.data,
          page_id: EmptyString,
          category_type: EmptyString,
          limit,
        },
      }
      break
    case EngageEventTypes.SEARCH:
      payload = {
        data: {
          ...payload.data,
          term: EmptyString,
          limit,
        },
      }
      break
    case EngageEventTypes.CROSS_SELL_BY_CATEGORIES:
      payload = {
        data: {
          ...payload.data,
          campaign_uuid: currentCampaign.campaign_uuid,
          current_item_id: sku,
          cross_sell_category_type: product?.classification?.category?.toLowerCase() || EmptyString,
          limit,
        },
      }
      break
    case EngageEventTypes.CROSS_SELL_ITEMS_SORTED:
      payload = {
        data: {
          ...payload.data,
          current_item_id: sku,
          base_category: product?.classification?.category?.toLowerCase() || EmptyString,
          limit,
        },
      }
      break
  }
  return JSON.stringify(payload)
}
