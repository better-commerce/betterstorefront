import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { B2B_COMPANY_HIERARCHY, EmptyObject } from '@components/utils/constants'

export default function useCompanyHierarchy() {
  return async function handler(companyId: any, cookies = EmptyObject) {
    const url = `${B2B_COMPANY_HIERARCHY}${companyId}/company`
    try {
      // const url = `company-hierarchy?filters[companyid]=${companyId}`;
      // const response: any = await fetcher({
      //   url: url,
      //   method: 'get',
      //   cookies
      // })
      const response = {
        data: {
          items: [
            {
              id: '3cc7c95e-3ba3-4e40-8eb4-017f16e2c900',
              name: 'India',
              type: 1,
              typeLabel: 'Country',
              parentId: '00000000-0000-0000-0000-000000000000',
              companyId: 'b0d01d49-9ce4-4076-857f-ffe96ee1a758',
            },
            {
              id: 'e3de4059-7f72-4832-9275-2f87326f8d12',
              name: 'North Zone',
              type: 2,
              typeLabel: 'Zone',
              parentId: '3cc7c95e-3ba3-4e40-8eb4-017f16e2c900',
              companyId: 'b0d01d49-9ce4-4076-857f-ffe96ee1a758',
            },
            {
              id: 'f1588e89-2f23-47a3-94f5-6e460fcff55a',
              name: 'Noida Branch',
              type: 3,
              typeLabel: 'Branch',
              parentId: 'e3de4059-7f72-4832-9275-2f87326f8d12',
              companyId: 'b0d01d49-9ce4-4076-857f-ffe96ee1a758',
            },
            {
              id: '27972ae9-14dc-4536-bbaf-bfb5817569c4',
              name: 'South Zone',
              type: 2,
              typeLabel: 'Zone',
              parentId: '3cc7c95e-3ba3-4e40-8eb4-017f16e2c900',
              companyId: 'b0d01d49-9ce4-4076-857f-ffe96ee1a758',
            },
          ],
          totalRecords: 4,
          page: 1,
          pageSize: 10,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
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
