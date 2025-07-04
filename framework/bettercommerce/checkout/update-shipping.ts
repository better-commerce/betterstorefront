import { BASKET_ENDPOINT, DeliveryType, EmptyString } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
import { Guid } from '@commerce/types'
import { createDeliveryPlans, getShippingPlans, updateDelivery } from '@framework/shipping'

interface Props {
  basketId?: string
  countryCode?: string
  shippingId?: string
  shippingAddress: any
  isOmniOmsEnabled?: boolean
  primaryInventoryPoolCode?: string
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({ basketId, shippingId, countryCode, shippingAddress, isOmniOmsEnabled = false, primaryInventoryPoolCode = "", cookies, }: Props) {
    let updateShippingResponse: any
    const url = BASKET_ENDPOINT + `/${basketId}/delivery/shipping-method?shippingMethodId=${shippingId}&countryCode=${countryCode}`
    try {
      updateShippingResponse = await fetcher({ url, method: 'put', headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, }, cookies, })
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }

    const cdp = (shippingAddress?.id > 0)
    if (cdp) {
      const data = { basketId }
      const { result: basket }: any = await fetcher({ url: `${BASKET_ENDPOINT}/${basketId}`, method: 'get', data, cookies, headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, }, })
      const addr = { ...shippingAddress }

      if (isOmniOmsEnabled) {
        const shippingMethod: any = basket?.shippingMethods?.find((x: any) => x?.id === basket?.shippingMethodId)
        const deliveryPlanModel = {
          basketId,
          orderId: Guid.empty,
          postCode: addr?.postCode,
          shippingMethodType: shippingMethod?.type || DeliveryType.STANDARD_DELIVERY,
          shippingMethodId: basket?.shippingMethodId,
          shippingMethodName: shippingMethod?.displayName,
          shippingMethodCode: shippingMethod?.shippingCode,
          orgId: process.env.NEXT_PUBLIC_ORG_ID,
          domainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
          deliveryItems: basket?.lineItems?.length ? basket?.lineItems?.filter((item: any) => !item?.isMembership)?.map((item: any) => ({ basketLineId: item.id, productId: item?.productId || item?.recordId, parentProductId: Guid.empty, stockCode: item?.stockCode, qty: item?.qty, })) : [],
          primaryInventoryPool: primaryInventoryPoolCode,
          secondaryInventoryPool: EmptyString,
        }
        const deliveryPlanRes = await getShippingPlans()({ model: deliveryPlanModel, cookies })
        const updateDeliveryPlanModel = deliveryPlanRes?.map((plan: any) => ({
          recordId: plan?.RecordId,
          deliveryType: plan?.DeliveryType,
          fulfilmentChannel: plan?.FulfilmentChannel,
          shippingType: plan?.ShippingType,
          shippingMethodId: plan?.ShippingMethodId,
          shippingCharge: 0,
          pickupStoreId: plan?.PickupStoreId,
          refStoreId: plan?.RefStoreId,
          pickupStoreCode: plan?.PickupStoreCode,
          deliveryCenter: { recordId: plan?.DeliveryCenter?.RecordId, code: plan?.DeliveryCenter?.Code, name: plan?.DeliveryCenter?.Name, },
          leadTime: plan?.LeadTime,
          leadTimeUom: plan?.LeadTimeUom,
          poolCode: plan?.PoolCode,
          items: plan?.Items?.map((item: any) => ({ recordId: item?.RecordId, basketLineId: item?.BasketLineId, parentProductId: item?.ParentProductId, orderLineRecordId: item?.OrderLineRecordId, stockCode: item?.StockCode, productId: item?.ProductId, qty: item?.Qty, fulfilmentChannel: item?.FulfilmentChannel, created: item?.Created, leadTime: item?.LeadTime, leadTimeUom: item?.LeadTimeUom, deliveryType: item?.DeliveryType, inventoryType: item?.InventoryType, poolCode: item?.PoolCode, lineDeliveryCenterCode: item?.LineDeliveryCenterCode, lineDeliveryCenterId: item?.LineDeliveryCenterId, })),
          deliveryPlanNo: plan?.DeliveryPlanNo,
        }))
        const updateDeliveryPlanRes = await updateDelivery()({ data: updateDeliveryPlanModel, id: basketId!, cookies })
      } else {
        const deliveryPlanModel = {
          basketId,
          postCode: addr?.postCode || EmptyString,
          shippingMethodType: EmptyString,
          shippingMethodId: EmptyString,
          shippingMethodName: EmptyString,
          shippingMethodCode: EmptyString,
          deliveryItems: basket?.lineItems?.filter((item: any) => !item?.isMembership)?.map((item: any) => { return { basketLineId: Number(item.id), productId: item?.productId, parentProductId: item?.parentProductId, stockCode: item?.stockCode, qty: item?.qty, poolCode: item?.poolCode || null, } }),
        }
        const deliveryPlanRes = await createDeliveryPlans()({ model: deliveryPlanModel, cookies, })
      }
    }

    return updateShippingResponse?.result || {}
  }
}
