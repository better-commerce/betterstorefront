import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import qs from 'qs'
import { SEARCH_MINIMAL_ENDPOINT } from '@components/utils/constants'

export default function getAllProductsOperation({}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    cookies = {},
  }: {
    query?: any
    cookies?: any
  } = {}): Promise<any> {
    const {
      freeText = '',
      filters,
      sortBy,
      sortOrder,
      currentPage,
      collectionId = '',
      categoryId = '',
      brandId = '',
      pageSize = 20,
      stockCodes = [],
      excludeOOSProduct = true,
    } = query
    const data: any = {
      freeText,
      pageSize,
      allowFacet: true,
      facetOnly: false,
      sortBy,
      sortOrder,
      currentPage,
      collectionId,
      categoryId,
      brandId,
      stockCodes,
      excludeOOSProduct,
    }

    if (filters?.length) {
      data.filters = filters
    }

    try {
      const response: any = await fetcher({
        url: SEARCH_MINIMAL_ENDPOINT,
        method: 'post',
        data: qs.stringify(data),
        cookies,
      })

      return {
        snippets: response?.snippets ?? [],
        products: response.result || {
          results: [],
          sortList: [],
          pages: 0,
          total: 0,
          currentPage: 1,
        },
      }
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getAllProducts
}
