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

    const filters = JSON.parse(parsedQuery.filters)

    const sortBy = parsedQuery.sortBy
    const sortOrder = parsedQuery.sortOrder
    const currentPage = parsedQuery.currentPage

    const data: any = {
      freeText: '',
      pageSize: 20,
      allowFacet: true,
      facetOnly: false,
      sortBy,
      sortOrder,
      currentPage,
    }

    if (filters.length) {
      data.filters = filters
    }
    try {
      const response: any = await fetcher({
        url: SEARCH_MINIMAL_ENDPOINT,
        method: 'post',
        data: qs.stringify(data),
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
      console.log(error)
      throw new Error(error)
    }
  }
  return getAllProducts
}
