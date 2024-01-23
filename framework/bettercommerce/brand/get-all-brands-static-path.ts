import { STATIC_BRANDS_PATH_ENABLED } from '@framework/utils/constants'
import fetcher from '../fetcher'
import { STATIC_BRAND_PATHS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function getAllBrandsStaticPath() {
  try {
    const response: any = await fetcher({
      url: STATIC_BRAND_PATHS,
      method: 'get',
    })
    const brands =
      STATIC_BRANDS_PATH_ENABLED == true
        ? response?.result?.map(({ url }: any) => ({ slug: url }))
        : []
    return brands
  } catch (error: any) {
    logError(error)
    return []
  }
}
