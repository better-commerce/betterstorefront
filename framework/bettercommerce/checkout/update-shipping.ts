import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  basketId?: string
  countryCode?: string
  shippingId?: string
  cookies?: any
}

export default function updateShippingMethod() {
  return async function handler({
    basketId,
    shippingId,
    countryCode,
    cookies,
  }: Props) {
    const url =
    BASKET_ENDPOINT +
      `/${basketId}/delivery/shipping-method?shippingMethodId=${shippingId}&countryCode=${countryCode}`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
