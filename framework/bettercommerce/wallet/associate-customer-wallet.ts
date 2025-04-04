import { WALLET_WALLET_ASSOCIATE_TO_CUSTOMER } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

export default async function associateWalletToCustomer(
  id: any,
  walletId: any,
  cookies?: any
) {
  try {
    const response: any = await fetcher({
      url: `${WALLET_WALLET_ASSOCIATE_TO_CUSTOMER}/${id}/wallet/${walletId}`,
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
