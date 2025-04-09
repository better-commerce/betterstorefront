import { WALLET_GET_CUSTOMER_WALLET } from '@components/utils/constants';
import fetcher from '@framework/fetcher';
import { logError } from '@framework/utils/app-util';
import { DIGITAL_WALLET_BASE_URL } from '@framework/utils/constants';

export default function getCustomerWalletBalanceById(walletId: string, cookies?: any) {
  async function getCustomerWalletByIdAsync() {
    try {
      const response: any = await fetcher({
        baseUrl: DIGITAL_WALLET_BASE_URL,
        url: `${WALLET_GET_CUSTOMER_WALLET}/${walletId}/balance`,
        method: 'GET',
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      });
      return response;
    } catch (error: any) {
      logError(error);
      throw error
    }
  }
  return getCustomerWalletByIdAsync();
}
