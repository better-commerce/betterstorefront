import fetcher from '../../../fetcher'
import { CATALOG_ENDPOINT } from '@components/utils/constants'

export default async function getBrands(query: any) {
  console.log(query, 'query')
  try {
    const response: any = await fetcher({
      url: `${CATALOG_ENDPOINT}?page=${query.page || 1}&sortBy=${
        query.sortBy || 'bestSeller'
      }&sortOrder=${query.sortOrder || 'asc'}&brandIds=${query.brandIds || ''}`,
      method: 'get',
    })
    return response
  } catch (error) {
    console.log(error)
    return { hasError: true, error }
  }
}
