import fetcher from '@framework/fetcher'
import { KIT_BUILDER_API_URL } from '@framework/utils/constants'
import { KIT_BRAND_PRODUCTS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function ({ query, headers, cookies }: any) {
  try {
    let url: any = KIT_BRAND_PRODUCTS + '?'

    if (query?.brandId) {
      url += `brandId=${query?.brandId}&`
    }

    if (query?.platformId) {
      url += `platformId=${query?.platformId}&`
    }

    // default value
    url += `includeOutOfStockItems=${query?.includeOutOfStockItems || 'false'}`

    url = new URL(url, KIT_BUILDER_API_URL)

    const response: any = await fetcher({
      baseUrl: KIT_BUILDER_API_URL,
      url: url,
      method: 'get',
      headers,
      cookies,
    })

    return response?.result || []
  } catch (error: any) {
    logError(error)
  }
}
