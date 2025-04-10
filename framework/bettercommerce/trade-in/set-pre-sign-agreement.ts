import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
export default function setPreSignAgreementById(id: string,  cookies?: any) {
  async function setPreSignAgreementByIdAsync() {
    const url = new URL(`${TRADE_IN_GET_QUOTE_BY_ID}/${id}/sign-agreement`, TRADE_IN_BASE_URL)
    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        method: 'PUT',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return setPreSignAgreementByIdAsync()
}
