import fetcher from '../../../fetcher'
import { CATALOG_ENDPOINT, EmptyObject } from '@components/utils/constants'

export default async function getBrands(query: any, cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: `${CATALOG_ENDPOINT}/all?page=${query.page || 1}&pageSize=200&sortBy=${
        query.sortBy || 'manufacturerName'
      }&sortOrder=${query.sortOrder || 'asc'}&brandIds=${query.brandIds || ''}`,
      method: 'get',
      cookies
    })

    return response
  } catch (error) {
    return { hasError: true, error }
  }
}
