// Other Imports
import fetcher from '@framework/fetcher'
import { BASKET_ENDPOINT } from '@components/utils/constants'

export default async function useValidatePaymentLink({ link, cookies }: any) {
  try {
    const response = await fetcher({
      url: `${BASKET_ENDPOINT}/${link}/validatepayment`,
      method: 'POST',
      cookies: cookies,
    })
    return response
  } catch (error: any) {
    console.log(error)
    return { hasError: true, error: error?.message }
  }
}
