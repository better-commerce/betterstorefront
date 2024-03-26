// Other Imports
import fetcher from '@framework/fetcher'
import { BASKET_ENDPOINT } from '@new-components/utils/constants'
import { logError } from '@framework/utils/app-util'

export default async function useValidatePaymentLink({ link, cookies }: any) {
  try {
    const response = await fetcher({
      url: `${BASKET_ENDPOINT}/${link}/validatepayment`,
      method: 'POST',
      cookies: cookies,
    })
    return response
  } catch (error: any) {
    logError(error)
    return {
      hasError: true,
      errorId: error?.data?.errorId,
      error: error?.data?.message,
    }
  }
}
