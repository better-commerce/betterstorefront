import fetcher from '../../../fetcher'
import { CATALOG_ENDPOINT } from '@components/utils/constants'

export default async function getBrandBySlug(slug: string, cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${CATALOG_ENDPOINT}/slug?slug=${slug}`,
      method: 'post',
      cookies,
    })
    return {
      ...response,
      ...{ snippets: response?.snippets ?? [] },
      ...{ status: response?.status },
    }
  } catch (error) {
    return { hasError: true, error }
  }
}
