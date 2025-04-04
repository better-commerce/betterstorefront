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
    try {
      const response: any = await fetcher({
        baseUrl: DIGITAL_WALLET_BASE_URL,
        url: `${WALLET_GET_CUSTOMER_WALLET}/${walletId}/transactions`, // Wallet ID in URL
        method: 'POST', // ✅ Ensure it's a POST request
        data, // ✅ Send pagination & filters in the request body
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      });
      return response;
    } catch (error: any) {
      logError(error);
    }
  }
  return getCustomerWalletTransactionByIdAsync();
}
