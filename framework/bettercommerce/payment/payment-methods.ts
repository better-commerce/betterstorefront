import fetcher from '../fetcher'
import { encrypt } from '@framework/utils/cipher'
import { SECURE_PAYMENT_METHODS_SETTINGS_FIELDS, PAYMENTS_ENDPOINT, PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS } from '@components/utils/constants'

interface Props {
  countryCode: string
  currencyCode: string
  readonly basketId: string;
  cookies?: any
}

export default function getPaymentMethods() {
  return async function handler({ countryCode, currencyCode, basketId, cookies }: Props) {
    try {
      const response: any = await fetcher({
        url: `${PAYMENTS_ENDPOINT}?country=${countryCode}&currency=${currencyCode}&basketId=${basketId}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      });
      console.log(JSON.stringify(response))

      if (SECURE_PAYMENT_METHODS_SETTINGS_FIELDS && PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS) {
        const UI_HIDDEN_SETTINGS_FIELDS = PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS.split(",");

        if (response?.result?.length) {
          return response?.result?.map((x: any) => ({
            ...x,
            ...{
              notificationUrl: encrypt(x?.notificationUrl || ""),
            },
            ...{
              settings: x?.settings?.map((setting: any) => {
                if (UI_HIDDEN_SETTINGS_FIELDS.includes(setting?.key)) {
                  return {
                    ...setting,
                    ...{
                      value: setting?.value ? encrypt(setting?.value) : null
                    },
                  }
                }
                return setting;
              })
            }
          }));
        }
      }
      return response?.result;
    } catch (error: any) {
      console.log(error);
      // throw new Error(error.message)
    }
  }
}
