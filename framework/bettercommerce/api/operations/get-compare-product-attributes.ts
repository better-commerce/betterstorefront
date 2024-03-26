import fetcher from '../../fetcher'
import { PRODUCT_CUSTOM_ATTRIBUTES } from '@new-components/utils/constants'

export default async function getCompareProductAttributes(
  stockCodes: any,
  compareAtPLP: any,
  compareAtPDP: any,
  cookies?: any
) {
  try {
    const response: any = await fetcher({
      url: PRODUCT_CUSTOM_ATTRIBUTES,
      method: 'post',
      data: { stockCodes: stockCodes, compareAtPLP: compareAtPLP, compareAtPDP: compareAtPDP },
      cookies,
    })
    return response?.result || []
  } catch (error: any) {
    return null
    //throw new Error(error)
  }
}
