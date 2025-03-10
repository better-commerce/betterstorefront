import { logError } from '@framework/utils/app-util';
import {  TRADE_IN_LOGGED_IN_QUOTE_SEND } from '@components/utils/constants'
import fetcher from '@framework/fetcher';

export default function postQuote(data: string, cookies?: any) {
  async function postQuoteAsync() {
    const url = `${TRADE_IN_LOGGED_IN_QUOTE_SEND}/${data}`;
    try {
      const response: any = await fetcher({
        url ,
        method: 'POST',
        cookies
      })
      return response.result
    } catch (error: any) {
      logError(error)
    }
  }
  return postQuoteAsync()
}
