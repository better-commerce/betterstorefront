import type { BetterCommerceConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import data from '../../data.json'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import { CACHED_IMAGE_ENDPOINT } from '@components/utils/constants'
export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getPdpCachedImage({
    query = '',
    cookies,
  }: {
    query?: string
    cookies?: any
  } = {}): Promise<any> {
    const response: any = await fetcher({
      url: `${CACHED_IMAGE_ENDPOINT}/${query}/image`,
      method: 'post',
      cookies,
    })
    return {
      images: response.result,
    }
  }

  return getPdpCachedImage
}
