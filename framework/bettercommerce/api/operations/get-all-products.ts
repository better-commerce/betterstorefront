import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'

export default function getAllProductsOperation({}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
  }: {
    query?: string
  } = {}): Promise<any> {
    const parsedQuery = JSON.parse(query)
    try {
      const response: any = await fetcher({
        url: `api/v1/catalog/search/r`,
        method: 'post',
        // url: `api/v1/catalog/product?page=${parsedQuery.page}&sortBy=${parsedQuery.sortBy}&sortOrder=${parsedQuery.sortOrder}`,
      })
      console.log(response)
      return {
        products: response.result.products || [],
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error)
    }
  }
  return getAllProducts
}
