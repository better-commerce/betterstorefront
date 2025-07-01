import { TRADE_IN_GET_ASSESSMENT_STATUS, } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default function updateProductNotes( id: string, notes: Array<{ stage: number }>, cookies: any ) {
  async function updateProductNotesAsync() {
    const url = new URL( `${TRADE_IN_GET_ASSESSMENT_STATUS}/${id}/notes`, BC_API_BASE_URL )

    try {
      const response = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: url.href,
        data: { notes: notes },
        method: 'PUT',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return updateProductNotesAsync()
}
