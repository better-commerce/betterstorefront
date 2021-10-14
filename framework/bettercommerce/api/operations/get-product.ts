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
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<BetterCommerceConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    console.log(query)
    const response = await fetcher({
      url: `/api/v1/catalog/product/slug?slug=${query}`,
      method: 'get',
    })
    return {
      product: response,
      // product: data.products.find(({ slug }) => slug === variables!.slug),
      // const response = await fetcher(`api/v1/catalog/product/slug?slug=${query.slug}`)
    }
  }

  return getProduct
}
