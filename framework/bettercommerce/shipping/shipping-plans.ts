import { OMS_SHIPPING_PLANS } from '@components/utils/constants'
import { OMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  model: any
  cookies?: any
}

export default function getShippingPlans() {
  return async function handler({ model, cookies }: Props) {
    const url = new URL(OMS_SHIPPING_PLANS, OMS_BASE_URL)
    const enhancedModel = {
      ...model,
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      OrgId: process.env.NEXT_PUBLIC_ORG_ID,
    }
    try {
      const response: any = await fetcher({
        url: url,
        method: 'post',
        data: {
          ...enhancedModel,
        },
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
          //Authorization: `Bearer ${token}`
        },
        baseUrl: OMS_BASE_URL,
      })
      return response.Result //for omsapi20 response.Result, for oms.dev-omnicx response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
