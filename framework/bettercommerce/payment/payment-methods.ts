import fetcher from '../fetcher'
import {
  SECURE_PAYMENT_METHODS_SETTINGS_FIELDS,
  PAYMENTS_ENDPOINT,
  PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS,
} from '@components/utils/constants'
import { parsePaymentMethods } from '@framework/utils/app-util'

interface Props {
  countryCode: string
  currencyCode: string
  readonly basketId: string
  cookies?: any
  secureFieldValuesExplicitlyDisabled?: boolean
}

export default function getPaymentMethods() {
  return async function handler({
    countryCode,
    currencyCode,
    basketId,
    cookies,
    secureFieldValuesExplicitlyDisabled = false,
  }: Props) {
    try {
      const response: any = await fetcher({
        url: `${PAYMENTS_ENDPOINT}?country=${countryCode}&currency=${currencyCode}&basketId=${basketId}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })

      if (
        !secureFieldValuesExplicitlyDisabled &&
        SECURE_PAYMENT_METHODS_SETTINGS_FIELDS &&
        PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS
      ) {
        if (response?.result?.length) {
          return parsePaymentMethods(response?.result)
        }
      }
      return response?.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
