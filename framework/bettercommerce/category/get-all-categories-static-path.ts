import { STATIC_CATEGORIES_PATH_ENABLED } from '@framework/utils/constants'
import fetcher from '../fetcher'
import { EmptyObject, STATIC_CATEGORY_PATHS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function getAllCategoriesStaticPath(cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: STATIC_CATEGORY_PATHS,
      method: 'get',
      cookies
    })
    const categories =
      STATIC_CATEGORIES_PATH_ENABLED == true
        ? response?.result?.map(({ url }: any) => ({ slug: url }))
        : []
    return categories
  } catch (error: any) {
    logError(error)
    return []
  }
}
