import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import qs from 'qs'
import { SEARCH_MINIMAL_ENDPOINT } from '@components/utils/constants'

export default function getAllProductsOperation({}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
  }: {
    query?: string
  } = {}): Promise<any> {
    const parsedQuery = JSON.parse(query)

    try {
      const response: any = await fetcher({
        url: SEARCH_MINIMAL_ENDPOINT,
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
