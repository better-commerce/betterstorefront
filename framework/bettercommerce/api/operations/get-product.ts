import type { BetterCommerceConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import data from '../../data.json'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
  }: {
    query?: string
  } = {}): Promise<any> {
    const response: any = await fetcher({
      url: `${PRODUCT_API_ENDPOINT}slug?slug=products/${query}`,
      method: 'post',
    })
    return {
      product: response.result,
      snippets: response.snippets,
    }
  }

  return getProduct
}
