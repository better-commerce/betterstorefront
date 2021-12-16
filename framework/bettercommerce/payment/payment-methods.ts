import { PAYMENTS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  countryCode: string
  currencyCode: string
}

export default function getPaymentMethods() {
  return async function handler({ countryCode, currencyCode }: Props) {
    try {
      const response: any = await fetcher({
        url: `${PAYMENTS_ENDPOINT}?country=${countryCode}&currency=${currencyCode}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
