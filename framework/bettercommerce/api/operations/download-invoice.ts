import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { B2B_COMPANY_USERS } from '@components/utils/constants'

export default function downloadInvoice() {
  async function downloadInvoiceAsync({ body, cookies }: any) {
    const url = `${B2B_COMPANY_USERS}${body?.companyId}/invoice`
    try {
      const response: any = await fetcher({
        url,
        method: 'post',
        data: body,
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
      throw new Error(error)
    }
  }
  return downloadInvoiceAsync
}
