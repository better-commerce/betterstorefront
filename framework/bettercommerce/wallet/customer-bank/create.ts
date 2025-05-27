import { BANK_DETAILS } from '@components/utils/constants'
import fetcher from '../../fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default async function createBankDetails(data: any, cookies: any) {
  async function createBankDetailsAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
        url: BANK_DETAILS,
        method: 'POST',
        data,
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error
    }
  }
  return createBankDetailsAsync()
}
