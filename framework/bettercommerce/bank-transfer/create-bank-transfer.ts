import { BANK_TRANSFER } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
import { DIGITAL_WALLET_BASE_URL } from '@framework/utils/constants'

export default async function createBankTransfer(data: any, cookies: any) {
  async function createBankTransferAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: DIGITAL_WALLET_BASE_URL,
        url: BANK_TRANSFER,
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
  return createBankTransferAsync()
}
