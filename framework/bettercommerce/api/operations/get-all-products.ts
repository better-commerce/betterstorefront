import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import qs from 'qs'

export default function getAllProductsOperation({}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
  }: {
    query?: string
  } = {}): Promise<any> {
    const parsedQuery = JSON.parse(query)

    console.log({ freeText: '', pageSize: 20, ...parsedQuery }, 'parsed data')
    try {
      const response: any = await fetcher({
        url: `/api/v1/catalog/search/advanced/minimal`,
        method: 'post',
        data: qs.stringify({
          freeText: '',
          pageSize: 20,
          allowFacet: true,
          facetOnly: false,
          ...parsedQuery,
        }),
      })
      return {
        products: response.result || {
          results: [],
          sortList: [],
          pages: 0,
          total: 0,
          currentPage: 1,
        },
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAllProducts
}
