import { WALLET_ENABLE_CUSTOMER_WALLET } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

export default async function enableCustomerWalletById(data: any, cookies?: any) {
  try {
    const response: any = await fetcher({
      baseUrl: BC_API_BASE_URL,
      url: `${WALLET_ENABLE_CUSTOMER_WALLET}`,
      method: 'POST',
      data, // This must be: { customerId: "UUID" }
      cookies,
      headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
    })
    return response
  } catch (error: any) {
    logError(error)
    throw error // Let it propagate to the middleware handler
  }
}
