// import { ORDERS_ENDPOINT } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import fetcher from '../fetcher'
import { ORDERS_ENDPOINT } from '@components/utils/constants'

interface Props {
  data: any
  cookies: any
}

export default function downloadOrderInvoice() {
  return async function handler({ data, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${ORDERS_ENDPOINT}/${data?.orderId}/invoice-pdf`, // paste the API endpoint here
        method: 'get',
        data: data,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}