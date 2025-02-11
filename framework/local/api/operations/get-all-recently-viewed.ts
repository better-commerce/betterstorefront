import { Product } from '@commerce/types/product'
import type { getAllRecentlyViewedProductsOperation } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { BetterCommerceConfig, Provider } from '../index'
import data from '../../data.json'

export default function getAllRecentlyViewedProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllRecentlyViewedProducts<T extends getAllRecentlyViewedProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BetterCommerceConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    return {
      products: data.products,
    }
  }
  return getAllRecentlyViewedProducts
}
