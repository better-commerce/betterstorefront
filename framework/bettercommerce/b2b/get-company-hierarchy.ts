import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_HIERARCHY, EmptyObject } from '@components/utils/constants'
import { BETTERCOMMERCE_ORDER_WORKFLOW_BASE_URL } from '@framework/utils/constants'

export default function useCompanyHierarchy() {
  return async function handler(companyId: any, cookies = EmptyObject) {
    const url = `${B2B_COMPANY_HIERARCHY}?filters[companyid]=${companyId}`
    try {
      const response: any = await fetcher({
        url: url,
        method: 'get',
        cookies,
        baseUrl: BETTERCOMMERCE_ORDER_WORKFLOW_BASE_URL,
      })
      return response
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
