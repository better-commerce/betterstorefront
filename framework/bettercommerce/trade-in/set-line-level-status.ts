import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants';
import fetcher from '@framework/fetcher';
import { logError } from '@framework/utils/app-util';
import { TRADE_IN_BASE_URL } from '@framework/utils/constants';

export default function saveQuoteByItemId(
  id: string,
  itemId: string,
  status: number,
  rejectionReason: number,
  cookies?: any
) {
  async function saveQuoteByItemIdAsync() {
    const url = new URL(
      `${TRADE_IN_GET_QUOTE_BY_ID}/${id}/item/${itemId}/review`,
      TRADE_IN_BASE_URL
    );

    try {
      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        data: { status, rejectionReason }, // Fixed data structure
        method: 'PUT',
        cookies,       
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
        logRequest:false,
      });

      return response;
    } catch (error: any) {
      logError(error);
      throw new Error(`Error saving quote by item ID: ${error.message}`);
    }
  }

  return saveQuoteByItemIdAsync();
}
