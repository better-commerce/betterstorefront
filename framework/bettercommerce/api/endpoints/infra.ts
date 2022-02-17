import { INFRA_ENDPOINT } from '@components/utils/constants'
import fetcher, { setGeneralParams } from '../../fetcher'

export default function useInfra(req: any) {
  //TODO change based on location
  return async function handler(setHeader = false) {
    try {
      const response: any = await fetcher({
        url: `${INFRA_ENDPOINT}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      if (setHeader) {
        setGeneralParams(
          'Currency',
          req.cookies.Currency ||
            response.result.configSettings
              .find((setting: any) => setting.configType === 'RegionalSettings')
              .configKeys.find(
                (item: any) =>
                  item.key === 'RegionalSettings.DefaultCurrencyCode'
              ).value ||
            'GBP'
        )
        setGeneralParams(
          'Language',
          req.cookies.Language ||
            response.result.configSettings
              .find((setting: any) => setting.configType === 'RegionalSettings')
              .configKeys.find(
                (item: any) =>
                  item.key === 'RegionalSettings.DefaultLanguageCode'
              ).value ||
            'en-GB'
        )
      }
      return {
        result: response.result,
        defaultCurrency:
          req.cookies.Currency ||
          response.result.configSettings
            .find((setting: any) => setting.configType === 'RegionalSettings')
            .configKeys.find(
              (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
            ).value ||
          'GBP',
        defaultLanguage:
          req.cookies.Language ||
          response.result.configSettings
            .find((setting: any) => setting.configType === 'RegionalSettings')
            .configKeys.find(
              (item: any) => item.key === 'RegionalSettings.DefaultLanguageCode'
            ).value ||
          'en',
      }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
