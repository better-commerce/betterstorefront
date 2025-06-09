import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_HIERARCHY_BY_PARENT_ID, EmptyObject, } from '@components/utils/constants'
import { BETTERCOMMERCE_ORDER_WORKFLOW_BASE_URL } from '@framework/utils/constants'

export default function useCompanyHierarchyByParentId() {
  return async function handler( companyId: string, parentId: string, cookies = EmptyObject ) {
    const url = `${B2B_COMPANY_HIERARCHY_BY_PARENT_ID}?companyId=${companyId}&parentId=${parentId}`
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
