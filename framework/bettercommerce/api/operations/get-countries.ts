import fetcher from '../../fetcher'
import { MASTER_DATA_ENDPOINT } from '@new-components/utils/constants'

export default function getCountries() {
  return async function handler(query: any) {
    const { cookies } = query
    const url = MASTER_DATA_ENDPOINT + `/25`
    try {
      const response: any = await fetcher({
        url,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response
    } catch (error: any) {
      // console.log(error, 'err')
      throw new Error(error.message)
    }
  }
}
