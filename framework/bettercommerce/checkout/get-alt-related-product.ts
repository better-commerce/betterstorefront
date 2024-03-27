import {
  COLLECTIONS_ENDPOINT,
  PRODUCT_API_ENDPOINT,
} from '@components//utils/constants'
import fetcher from '../fetcher'

interface Props {
  id?: string
}

export default function getAltRelatedProducts() {
  return async function handler(slug?: string, cookies?: any) {
    const url = COLLECTIONS_ENDPOINT + `/slug-minimal?slug=${slug}`
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
      console.log(error, 'err')
      // throw new Error(error.message)
    }
  }
}
