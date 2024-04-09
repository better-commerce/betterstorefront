import { logError } from '@framework/utils/app-util'
import { updateAddress } from '@framework/checkout'
import { createDeliveryPlans, getShippingPlans } from '@framework/shipping'
import { Guid } from '@commerce/types'
import { DeliveryType, EmptyObject, EmptyString } from '@components/utils/constants'
import { updateDelivery } from '@framework/shipping'

interface Props {
  postCode: any
  basket: any
  basketId?: string
  model: any
  cdp: boolean
  primaryInventoryPoolCode: string
  isOmniOmsEnabled: boolean
  isCNC?: boolean
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({
    basket,
    postCode,
    basketId,
    model,
    cdp,
    isOmniOmsEnabled = false,
    primaryInventoryPoolCode,
    isCNC = false,
    cookies,
  }: Props) {
    try {
      const response = await updateAddress()({
        basketId,
        model,
        isCNC,
        cookies,
      })
      if (cdp) {
        const addr = model?.shippingAddress || model?.billingAddress

        if (isOmniOmsEnabled) {
          const shippingMethod: any = basket?.shippingMethods?.find((x: any) => x?.id === basket?.shippingMethodId)
          const deliveryPlanModel = {
            basketId,
            orderId: Guid.empty,
            postCode: addr?.postCode || postCode,
            shippingMethodType: DeliveryType.DELIVER,
            shippingMethodId: basket?.shippingMethodId,
            shippingMethodName: shippingMethod?.displayName,
            shippingMethodCode: shippingMethod?.shippingCode,
            orgId: process.env.NEXT_PUBLIC_ORG_ID,
            domainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
            deliveryItems: basket?.lineItems?.length ? basket?.lineItems.map((item: any) => ({
              basketLineId: item.id,
              productId: item?.productId || item?.recordId,
              parentProductId: Guid.empty,
              stockCode: item?.stockCode,
              qty: item?.qty,
              //poolCode: "string"
            })) : [],
            //pickupStoreId: Guid.empty,
            //refStoreId: "string",
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
            deliveryCenter: {
              recordId: plan?.DeliveryCenter?.RecordId,
              code: plan?.DeliveryCenter?.Code,
              name: plan?.DeliveryCenter?.Name,
            },
            leadTime: plan?.LeadTime,
            leadTimeUom: plan?.LeadTimeUom,
            poolCode: plan?.PoolCode,
            items: plan?.Items?.map((item: any) => ({
              recordId: item?.RecordId,
              basketLineId: item?.BasketLineId,
              parentProductId: item?.ParentProductId,
              orderLineRecordId: item?.OrderLineRecordId,
              stockCode: item?.StockCode,
              productId: item?.ProductId,
              qty: item?.Qty,
              fulfilmentChannel: item?.FulfilmentChannel,
              created: item?.Created,
              leadTime: item?.LeadTime,
              leadTimeUom: item?.LeadTimeUom,
              deliveryType: item?.DeliveryType,
              inventoryType: item?.InventoryType,
              poolCode: item?.PoolCode,
              lineDeliveryCenterCode: item?.LineDeliveryCenterCode,
              lineDeliveryCenterId: item?.LineDeliveryCenterId,
            })),
            deliveryPlanNo: plan?.DeliveryPlanNo,
          }))
          const updateDeliveryPlanRes = await updateDelivery()({ data: updateDeliveryPlanModel, id: basketId!, cookies })
        } else {
          const deliveryPlanModel = {
            basketId,
            postCode: addr?.postCode || postCode || '',
            shippingMethodType: '',
            shippingMethodId: '',
            shippingMethodName: '',
            shippingMethodCode: '',
            deliveryItems: basket?.lineItems?.map((item: any) => {
              return {
                basketLineId: Number(item.id),
                productId: item?.productId,
                parentProductId: item?.parentProductId,
                stockCode: item?.stockCode,
                qty: item?.qty,
                poolCode: item?.poolCode || null,
              }
            }),
          }
          const deliveryPlanRes = await createDeliveryPlans()({ model: deliveryPlanModel, cookies, })

        }
      }
      return response.result
    } catch (error: any) {
      logError(error)
    }
  }
}
