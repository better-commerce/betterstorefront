import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_HIERARCHY_BY_PARENT_ID, EmptyObject, } from '@components/utils/constants'

export default function useCompanyHierarchyByParentId() {
  return async function handler( companyId: string, parentId: string, cookies = EmptyObject ) {
    const url = `${B2B_COMPANY_HIERARCHY_BY_PARENT_ID}?companyId=${companyId}&parentId=${parentId}`
    try {
      // const response: any = await fetcher({
      //   url: url,
      //   method: 'get',
      //   cookies
      // })
      const response = {
        data: [
          {
            id: 'f1588e89-2f23-47a3-94f5-6e460fcff55a',
            name: 'Noida Branch',
            type: 3,
            typeLabel: 'Branch',
            parentId: 'e3de4059-7f72-4832-9275-2f87326f8d12',
            companyId: 'b0d01d49-9ce4-4076-857f-ffe96ee1a758',
          },
        ],
        links: [
          {
            href: 'https://localhost:5109/admin/company-hierarchy',
            rel: 'self',
            method: 'GET',
          },
        ],
      }
      return response
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
