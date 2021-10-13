import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { BetterCommerceConfig, Provider } from '../index'
import fetcher from '../../fetcher'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BetterCommerceConfig>
    preview?: boolean
  } = {}): Promise<any> {
    try {
      const response: any = await fetcher({
        url: 'api/v1/catalog/category',
        method: 'get',
      })
      return {
        products: response.result,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAllProducts
}
