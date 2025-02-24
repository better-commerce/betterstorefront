import fetcher from '@framework/fetcher'
import { KIT_BUILDER_API_URL } from '@framework/utils/constants'
import { KIT_BRAND_CATEGORY } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function ({ query, cookies }: any) {
  try {
    let url: any = KIT_BRAND_CATEGORY + '?'

    if (query?.brandId) {
      url += `brandId=${query?.brandId}&`
    }

    if (query?.platformId) {
      url += `platformId=${query?.platformId}&`
    }

    if (query?.productApplication) {
      url += `productApplication=${query?.productApplication}&`
    }

    // default value
    url += `includeOutOfStockItems=${query?.includeOutOfStockItems || 'false'}`

    url = new URL(url, KIT_BUILDER_API_URL)

    const response: any = await fetcher({
      url: url,
      method: 'get',
      cookies,
      baseUrl: KIT_BUILDER_API_URL,
    })

    return response?.result || []
  } catch (error: any) {
    logError(error)
  }
}
