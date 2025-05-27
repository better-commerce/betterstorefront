import { GET_CUSOMER_BANK_LIST, WALLET_GET_CUSTOMER_WALLET } from '@components/utils/constants';
import fetcher from '@framework/fetcher';
import { logError } from '@framework/utils/app-util';
import { BC_API_BASE_URL } from '@framework/utils/constants';

export default function getCustomerBankList(
  walletId: string,
  data: any, // Pagination & filters
  cookies?: any
) {
  async function getCustomerBankListAsync() {
    const url = `${GET_CUSOMER_BANK_LIST}/${walletId}/search`
    try {
      const response: any = await fetcher({
        baseUrl: BC_API_BASE_URL,
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
  return getCustomerBankListAsync();
}
