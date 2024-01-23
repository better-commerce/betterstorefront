import { logError } from '@framework/utils/app-util'
import { updateAddress } from '@framework/checkout'
import { createDeliveryPlans } from '@framework/shipping'

interface Props {
  postCode: any
  basketItems: any
  basketId?: string
  model: any
  cdp: boolean
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({
    basketItems,
    postCode,
    basketId,
    model,
    cdp,
    cookies,
  }: Props) {
    try {
      const response = await updateAddress()({
        basketId,
        model,
        cookies,
      })
      if (cdp) {
        const addr = model?.shippingAddress || model?.billingAddress
        const deliveryPlanModel = {
          basketId,
          postCode: addr?.postCode || postCode || '',
          shippingMethodType: '',
          shippingMethodId: '',
          shippingMethodName: '',
          shippingMethodCode: '',
          deliveryItems: basketItems?.map((item: any) => {
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
        const deliveryPlanRes = await createDeliveryPlans()({
          model: deliveryPlanModel,
          cookies,
        })
      }
      return response.result
    } catch (error: any) {
      logError(error)
    }
  }
}
