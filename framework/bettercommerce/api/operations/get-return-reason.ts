import fetcher from '../../fetcher'
import { CANCEL_REASON } from '@new-components/utils/constants'
export default function getReturnReason() {
  return async function handler(query: any) {
    const { cookies } = query
    const url = CANCEL_REASON + `/29`
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
