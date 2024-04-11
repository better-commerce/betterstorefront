import fetcher from '@framework/fetcher'
import { B2B_USER_QUOTES } from '@components/utils/constants'

export default function useB2BSaveQuote() {
  return async function handler({ quote, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${B2B_USER_QUOTES}quote/save`,
        method: 'post',
        data: quote,
        cookies,
        logRequest: true,
      })
      return response
    } catch (error: any) {
      console.log(error, 'error')
    }
  }
}
