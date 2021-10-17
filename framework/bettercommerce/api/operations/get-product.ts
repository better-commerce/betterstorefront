import type { BetterCommerceConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import data from '../../data.json'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
  }: {
    query?: string
  } = {}): Promise<any> {
    const response: any = await fetcher({
      url: `/api/v1/catalog/product/slug?slug=products/${query}`,
      method: 'post',
    })
    return {
      product: response.result,
    }
  }

  return getProduct
}
