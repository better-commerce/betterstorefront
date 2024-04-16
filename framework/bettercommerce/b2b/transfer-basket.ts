import fetcher from '@framework/fetcher'
import { B2B_TRANSFER_BASKET } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default function useB2BTransferBasket() {
  return async function handler({ data , cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${B2B_TRANSFER_BASKET}`,
        method: 'post',
        data: data,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
