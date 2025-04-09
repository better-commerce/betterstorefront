import { WALLET_GET_CUSTOMER_WALLET } from '@components/utils/constants';
import fetcher from '@framework/fetcher';
import { logError } from '@framework/utils/app-util';
import { DIGITAL_WALLET_BASE_URL } from '@framework/utils/constants';

export default function getCustomerWalletTransactionById(
  walletId: string,
  data: any, // Pagination & filters
  cookies?: any
) {
  async function getCustomerWalletTransactionByIdAsync() {
    const url = `${WALLET_GET_CUSTOMER_WALLET}/${walletId}/transactions`
    try {
      const response: any = await fetcher({
        baseUrl: DIGITAL_WALLET_BASE_URL,
        url,
        method: 'GET',
        params: data,
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      });
      return response;
    } catch (error: any) {
      logError(error);
      throw error
    }
  }
  return getCustomerWalletTransactionByIdAsync();
}
