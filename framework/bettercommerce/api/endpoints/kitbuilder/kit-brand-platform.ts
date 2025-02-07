import fetcher from '@framework/fetcher'
import { KIT_BUILDER_API_URL } from '@framework/utils/constants'
import { KIT_BRAND_PLATFORM } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function ({ cookies }: any) {
  try {
    const url = new URL(KIT_BRAND_PLATFORM, KIT_BUILDER_API_URL)
    const response: any = await fetcher({
      url,
      method: 'get',
      cookies,
      baseUrl: KIT_BUILDER_API_URL,
    })
    return response?.result || []
  } catch (error: any) {
    logError(error)
  }
}
